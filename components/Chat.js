import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    // Creates a system message that announces the user's arrival and puts in a first message.
    componentDidMount() {
        let userJoinedMessage = `User ${this.props.route.params.name} has joined the chat.`;
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: userJoinedMessage,
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
    }

    // Adds messages to the current chat log.
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
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
                messages={this.state.messages}
                onSend = {messages => this.onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
            { 
                Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
            }
            </View>
        )
    }
}