import React from 'react';
import { View, Text } from 'react-native';

export default class Chat extends React.Component {
    
    render() {
        let name = this.props.route.params.name;
        let BGColor = this.props.route.params.BGColor;

        this.props.navigation.setOptions({ title: name });
        
        return (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: BGColor}}>
                <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>This is Chat! You made it, {name}!</Text>
            </View>
        )
    }
}