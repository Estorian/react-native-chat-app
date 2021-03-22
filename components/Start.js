import React from 'react';
import { View, Text, Image, TextInput, StyleSheet, ImageBackground, Pressable, Alert } from 'react-native';
import Icon from '../assets/icon.svg';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            BGColor: "#090C08"
        };
    }

    // Forces a user to select a username before they are allowed into the chat.
    checkName = () => {
        if (this.state.name == '') {
            Alert.alert('Please enter a username');
        } else {
        this.props.navigation.navigate('Chat', { name: this.state.name, BGColor: this.state.BGColor });
    }}
    
    //Sets the color of the chat screen
    setBackground = (color) => {
        this.setState({
            BGColor: color
        })
    }

    render() {
        // Sets the standard colors
        let colors= ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];
        

        return (
            <View style={styles.startScreen}>
                <ImageBackground source={require('../assets/Background.png')} style={styles.background}>
                    <Text style={styles.title}>Fancy Chat</Text>
                    <View style={styles.menuBox}>
                        <View style={styles.username}>
                            <Icon style={{ margin:10}}/>
                            <TextInput 
                                value={this.state.name}
                                onChangeText={(name) => this.setState({name})}
                                placeholder="Enter your username"
                            />
                        </View>
                        <View>
                            <Text style={{ color: "#757083", textAlign: 'center'}}>Choose a Background Color:</Text>
                            <View style={styles.colorSelector}>
                                
                                {colors.map((color) => {
                                    
                                    let selectedBorder = () => {
                                        if (color == this.state.BGColor) { return 2 }
                                        else return 0;

                                    };
                                    
                                    
                                    return (
                                        <Pressable 
                                            key={color}
                                            style={[styles.outerCircle, {borderWidth: selectedBorder()}]}
                                            onPress={() => this.setBackground(color)}
                                        >
                                            <View style={[styles.innerCircle, {backgroundColor: color}]} />
                                        </Pressable>
                                    );
                                })}

                            </View>
                        </View>
                        <Pressable 
                            onPress={() => this.checkName()}
                            style={styles.chatButton}
                        >
                            <Text style={{color: "#FFFFFF", alignItems: 'center', fontWeight: 'bold', fontSize: 16}}>Start Chatting</Text>
                        </Pressable>
                    </View>
                    <View style={styles.spacer}></View>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    startScreen: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        fontSize: 45,
        fontWeight: "bold",
        color: '#FFFFFF',
        textAlignVertical: 'center'
    },
    menuBox: {
        flexWrap: 'nowrap',
        backgroundColor: '#FFFFFF',
        width: '88%',
        height: '44%',
        minHeight: 250,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignContent: 'center',
        margin: '6%',
        padding: 10
    },
    username: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#757083',
        borderWidth: 1,
        width: '88%',
        fontSize: 16,
        opacity: 50,
        minHeight: 50,
        maxHeight: 50,
        alignItems: 'center'
    },
    chatButton: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#757083',
        minHeight: 50,
        maxHeight: 50,
        padding: 10,
        width: '88%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    colorSelector: {
        flexDirection: 'row'
    },
    outerCircle: {
        height: 50,
        width: 50,
        borderRadius: 25,
        margin: 15,
        borderColor: "#757083",
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerCircle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        margin: 15,
    }
});