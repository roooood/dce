import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from '../library/Context';
import Modal from './Modal';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import VolumeOff from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Position from './Position';
import Info from './Info';
import play from './Sound';
import { t } from '../locales';

class Table extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props);
        this.state = {

        };
        this.modal = null;
        autoBind(this);
    }

    lose() {
        play('lose');
    }
    win() {
        play('win');
    }
    componentDidMount() {
        this.context.game.register('win', this.win);
        this.context.game.register('lose', this.lose);
        this.context.game.register('balanceLimit', this.balanceLimit);
    }
    standUp() {
        this.context.game.send({ stand: true });
    }
    leave() {
        this.context.game.leave();
    }
    balanceLimit() {
        let xalert = this.context.app('alert');
        xalert.show({ message: t('balanceLimit'), type: 'error' });
    }
    toggleSound() {
        let act = ('mute' in this.context.state) && this.context.state.mute ? false : true;
        play(!act);
        this.context.setState({ mute: act });
    }
    render() {
        return (
            <div style={styles.root}>
                <div style={styles.action}>
                    <div>
                        <IconButton onClick={this.leave} color="secondary" >
                            <Close />
                        </IconButton>
                        <IconButton onClick={this.standUp} style={{ color: '#fff' }} >
                            <ArrowUpward />
                        </IconButton>
                        <IconButton onClick={this.toggleSound} style={{ color: '#fff' }}>
                            {('mute' in this.context.state) && this.context.state.mute ? <VolumeOff /> : <VolumeUp />}
                        </IconButton>
                    </div>
                    {this.context.state.isMobile &&
                        <Info />
                    }
                </div>
                <Modal ref={r => this.modal = r} />
                <Position />
            </div>
        )
    }
}
const styles = {
    root: {
        display: 'flex',
        flex: 1,
        position: 'relative',
    },
    action: {
        position: 'absolute',
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
    }
}

export default Table;

