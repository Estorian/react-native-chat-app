import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';
import firestore from 'firebase';

export default class CustomActions extends React.Component {
    constructor(props) {
        super(props)
    }

    pickImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    
        try {
            if (status === 'granted') {  
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: 'Images',
                }).catch(error => console.log(error));
            
                if (!result.cancelled) {
                    const imageUrl = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch (e) {console.log(e)}
    }

    takePhoto = async () => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY);
    
        try {
            if (status === 'granted') {
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: 'Images',
                }).catch(error => console.log(error));
            
                if (!result.cancelled) {
                    const imageUrl = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch (e) { console.log(e)}
    }

    getLocation = async () => {
        const {status} = await Permissions.askAsync(Permissions.LOCATION);
    
        try {
            if (status === 'granted') {
                let result = await Location.getCurrentPositionAsync({})
                .catch ((e) => console.log(e));
                
                const longitude = JSON.stringify(result.coords.longitude);
                const lattitude = JSON.stringify(result.coords.lattitude);

                if (result) {
                    this.props.onSend({
                        location: {
                            longitude: result.coords.longitude,
                            latitude: result.coords.latitude
                        }
                    })
                }
            }
        } catch (e) {console.log(e)}
    }

    uploadImage = async (uri) => {
        //setting up the fetch request
        const blob = await new Promise((res, rej) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                res(xhr.response);
            };

            xhr.onerror = (e) => {
                console.log(e);
                rej(new TypeError('Network requestfailed'));
            };

            xhr.responseType = 'blob';
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
        
        //getting the file name for upload
        const imageName = uri.split('/');
        const imageFileName = imageName[imageName.length - 1];
        
        //get the firebase reference of where to put the image
        const ref = firebase.storage().ref().child(`images/${imageFileName}`);
        
        //making the fetch request to put the blob into the reference in the firebase
        const snapshot = await ref.put(blob);
        blob.close();

        return await snapshot.ref.getDownloadURL();
    }

    onActionPress = () => {
        const options = ['Select an Image to Send', 'Take new Photo', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        return this.pickImage();
                    case 1:
                        console.log('user wants to take a photo');
                        return this.takePhoto();
                    case 2:
                        console.log('user wants to send their location');
                        return this.getLocation();
                    default:
                }
            },
        );
    };

    

    render() {
        return (
            <TouchableOpacity 
                accessible={true}
                accessibilityLabel="More options"
                accessibilityHint="Select and image to send or your geolocation."
                style={[styles.container]} 
                onPress={this.onActionPress}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>
                        +
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};