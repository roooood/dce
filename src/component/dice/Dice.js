import React, { Component } from 'react';

const imgs = [
    null,
    require('./img/Dice1.png'),
    require('./img/Dice2.png'),
    require('./img/Dice3.png'),
    require('./img/Dice4.png'),
    require('./img/Dice5.png'),
    require('./img/Dice6.png'),
]

const Dice = (props) => {
    if (props.number == null)
        return null;
    if (typeof props.number == 'object') {
        let ret = [];
        for (let i of props.number)
            ret.push(<img style={{ width: 40, marginLeft: 4, marginRight: 4 }} src={imgs[i]} />)
        return ret;
    }
    return (
        <img style={{ width: 40, marginLeft: 4, marginRight: 4 }} src={imgs[props.number]} />
    );
}

export default Dice;