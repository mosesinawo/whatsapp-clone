import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../constants/colors';

const Bubble = ({text, type}) => {
    const bubbleStyles = {...styles.container};
    const textStyle = {...styles.text};

    switch (type) {
        case "system":
            textStyle.color = "#65644A";
            bubbleStyles.backgroundColor = colors.beige;
            bubbleStyles.alignItems = "center";
            bubbleStyles.marginTop = 10
            break;
    
        default:
            break;
    }
  return (
    <View style={styles.wrapperStyle}>
        <View style={bubbleStyles}>

      <Text style={textStyle}>{text}</Text>
        </View>
    </View>
  )
}

export default Bubble

const styles = StyleSheet.create({
    wrapperStyle:{
        flexDirection:'row',
        justifyContent:'center'
    },
    container:{
        backgroundColor:'white',
        borderRadius:6,
        padding:5,
        marginBottom:10,
       borderColor:'#E2DACC',
       borderWidth:1,
    },
    text:{
        fontFamily:'regular',
        letterSpacing:0.3
    }
})