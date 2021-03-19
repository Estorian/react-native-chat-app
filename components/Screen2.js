import React from 'react';
import { View, Text } from 'react-native';

export default class Screen2 extends React.Component {
    render() {
        return (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>This is Screen2! You made it!</Text>
            </View>
        )
    }
}