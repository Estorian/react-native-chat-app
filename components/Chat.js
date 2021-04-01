import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, InputToolbar, SystemMessage } from 'react-native-gifted-chat';
import firebase from 'firebase';
import firestore from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            user: '',
            uid: '',
            isConnected: '',
        }


        const firebaseConfig = {
            apiKey: "AIzaSyCld5n94kpQ4zrCRGdbd0bnoc6nSjtWIdQ",
            authDomain: "rn-chat-app-6f67f.firebaseapp.com",
            projectId: "rn-chat-app-6f67f",
            storageBucket: "rn-chat-app-6f67f.appspot.com",
            messagingSenderId: "722808181511",
            appId: "1:722808181511:web:0eecd1a832386b41236ba2",
            measurementId: "G-B1XVBXMRC5"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.referenceChatMessages = firebase.firestore().collection("messages");
    }

    // gets messages, either from firebase or from the async-storage depending on isConnected.
    getMessages = async () => {
        let messages = '';
        if (this.state.isConnected) {
            this.referenceChatMessages = firebase.firestore().collection('messages');
            this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);
            
            this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                if (!user) {
                    firebase.auth().signInAnonymously();
                }
    
                //update user state with currently active user data
                this.setState({
                    messages: [],
                    uid: user.uid,
                });
                this.unsubscribe = this.referenceChatMessages
                    .orderBy("createdAt", "desc")    
                    .onSnapshot(this.onCollectionUpdate);
            
            });
            this.saveMessages();
        } else {
            try {
                messages = await AsyncStorage.getItem('messages');
                if (messages != null) {
                    this.setState({
                        messages: JSON.parse(messages)
                    });
                } else { console.log('Messages == null')}
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    // Creates a system message that announces the user's arrival and puts in a first message.
    componentDidMount() {
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                console.log('online');
                this.setState({
                    isConnected: true,
                });
            } else {
                console.log('offline');
                this.setState({
                    isConnected: false,
                })
            }
            this.getMessages();
        })

        this.setState({
            user: this.props.route.params.name,
        })
    }

    //Logs out of Firebase when the chat room is left.
    componentWillUnmount() {
        if (this.state.isConnected) {
            this.unsubscribe();
            this.authUnsubscribe();
        }
    }

    //Updates the messages in the state everytime they change on the firestore
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            //get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user
            });
        });
        this.setState({
            messages,
        });
    };

    // Used to clear messages from AsyncStorage
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    //Adds messages to the firebase.
    addMessage = (messageText) => {
        this.referenceChatMessages.add({
            _id: messageText[0]._id,
            text: messageText[0].text,
            createdAt: new Date(),
            user: {
                _id: this.state.uid,
                name: this.state.user
            }
        });
        this.saveMessages();
    }

    // Backs up messages to the asyncStorage
    saveMessages = async () => {
        
        try {
            let messages = JSON.stringify(this.state.messages);
            console.log('Attempting to save messages.');
            await AsyncStorage.setItem('messages', messages);
            console.log('Messages Saved.');
        } catch (error) {
            console.log(error.message);
        }
    }

    // Adds messages to the current chat log through GiftedChat without touching the state.
    onSend(messages = []) {
        this.saveMessages();
        GiftedChat.append(previousState.messages, messages);
        this.addMessage(messages);
    }

    // Changes the system message color depending on the background color for accessibility.
    renderSystemMessage(props) {
        if (this.props.route.params.BGColor == '#8A95A5' || this.props.route.params.BGColor == '#B9C6AE') {
            return (
                <SystemMessage
                    {...props}
                    textStyle={{
                        color: '#000',
                    }}
                />
            );
        } else {return (
                <SystemMessage {...props} />
            );
        }
    }

    // removes the ability to send messages when disconnected from the internet.
    renderInputToolbar(props) {
        if (!this.state.isConnected){
        } else {
            return(
                <InputToolbar {...props}/>
            );
        }
    }

    render() {
        let name = this.props.route.params.name;
        let BGColor = this.props.route.params.BGColor;

        setTimeout(() =>{
        this.props.navigation.setOptions({ title: name });
        }, 0);

        return (
            <View style={{ flex: 1, backgroundColor: BGColor}}>
            <GiftedChat
                renderSystemMessage={this.renderSystemMessage.bind(this)}
                renderInputToolbar={this.renderInputToolbar.bind(this)}
                messages={this.state.messages}
                onSend = {messages => this.addMessage(messages)}
                user={{
                    _id: this.state.uid,
                }}
            />
            { 
                Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
            }
            </View>
        )
    }
}