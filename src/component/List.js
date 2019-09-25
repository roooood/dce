import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import PeopleOutline from '@material-ui/icons/PeopleOutline';
import Refresh from '@material-ui/icons/Refresh';
import Stop from '@material-ui/icons/Stop';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import Visibility from '@material-ui/icons/Visibility';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { green, pink } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import autoBind from 'react-autobind';
import Context from '../library/Context';
import { toMoney, sum } from '../library/Helper';
import { t } from '../locales';
import CreateTable from './CreateTable';
import { Scrollbars } from 'react-custom-scrollbars';


class ListTable extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            rooms: []
        };
        autoBind(this);
        this.timer = null;
        this.inGame = false;
        this.getedList = false;
    }
    componentDidMount() {
        this.context.game.register('leave', this.leave);
        this.context.game.register('welcome', this.welcome);
        this.context.game.register('connect', this.connected);
    }
    connected() {
        this.getList()
        this.timer = setInterval(() => {
            this.getList()
        }, 5000);
    }
    welcome() {
        this.inGame = true;
        setTimeout(() => {
            this.getList();
        }, 500);
    }
    leave() {
        this.inGame = false;
        this.refresh();
    }
    refresh() {
        this.getList();
    }
    getList() {
        this.context.game.getAvailableRooms((rooms) => {
            this.getedList = true;
            this.setState({ rooms })
        });
    }
    have(arr, prop, id) {
        let i;
        for (i in arr) {
            if (typeof arr[i].metadata == 'object' && arr[i].metadata[prop] == id)
                return true;
        }
        return false
    }
    create() {
        let xalert = this.context.app('alert');
        if (!this.getedList) {
            xalert.show({ message: t('pleaseWait'), type: 'warning' });
        }
        else if (!('id' in this.context.state)) {
            xalert.show({ message: t('guestLimit'), type: 'warning' });
        }
        else if (this.have(this.state.rooms, 'ownerId', this.context.state.id)) {
            xalert.show({ message: t('cantCreate'), type: 'error' });
        }
        else if (this.inGame) {
            xalert.show({ message: t('inGameLimit'), type: 'error' });
        }
        else if (this.state.rooms.length >= this.context.state.setting.tableLimit) {
            xalert.show({ message: t('tableCreateLimit'), type: 'error' });
        }
        else if (this.context.state.balance < this.context.state.setting.minbet) {
            xalert.show({ message: t('balanceLimit'), type: 'error' });
        }
        else {
            this.modal.show();
        }

    }
    join(id) {
        if (this.inGame) {
            let xalert = this.context.app('alert');
            xalert.show({ message: t('inGameLimit'), type: 'error' });
        }
        else {
            const key = this.context.state.userKey;
            this.context.game.join(id, { key });
        }

    }
    render() {
        return (
            <div style={styles.root} >
                <Grid container>
                    {('id' in this.context.state) &&
                        <CreateTable ref={r => this.modal = r} />
                    }
                    <Grid container xs={4} justify="center" alignItems="center"  >
                        <Typography style={styles.text} display="inline">{t('tableCount')} :</Typography>
                        <Typography style={styles.xtext} display="inline">{this.state.rooms.length}</Typography>
                    </Grid>
                    <Grid container xs={4} justify="center" alignItems="center">
                        <Typography style={styles.text} display="inline">{t('users')} :</Typography>
                        <Typography style={styles.xtext} display="inline">{this.context.state.onlines}</Typography>
                    </Grid>
                    <Grid container xs={4} justify="center" alignItems="center">
                        <IconButton onClick={this.create} style={{ padding: 8, color: '#fff' }} aria-label="add">
                            <Add />
                        </IconButton>
                        {/* <IconButton style={{ padding: 8, color: pink[500] }} aria-label="filler">
                        <FilterList />
                    </IconButton> */}
                        <IconButton onClick={this.refresh} style={{ padding: 8, color: pink[500] }} aria-label="refresh">
                            <Refresh />
                        </IconButton>
                    </Grid>
                </Grid>
                <div style={{ width: '100%', height: '80vh' }}>
                    <Scrollbars style={{ direction: 'ltr', height: '100%' }} ref="scroll">
                        <List style={{ direction: this.context.state.dir }}>
                            {this.state.rooms.map((room, i) => {
                                if (typeof room.metadata == 'object') {
                                    let { title, player, min, max, owner, ownerId, ready } = room.metadata;
                                    return (
                                        <ListItem key={i}
                                            style={{
                                                ...styles.item, ...(ownerId != this.context.state.id
                                                    ? ((('table' in this.context.state) && this.context.state.table.roomID == room.roomId) ? styles.inTable : {})
                                                    : styles.myTable)
                                            }}>
                                            <ListItemAvatar style={styles.avatarItem}>
                                                <Avatar style={styles.avatar}>
                                                    {owner[0].toUpperCase()}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText style={styles.listItem} primary={
                                                <>
                                                    <Typography style={styles.itemText} >{title}</Typography>
                                                    <Typography style={styles.subText} >{owner}</Typography>
                                                </>
                                            } />
                                            <ListItemText style={styles.listItem} primary={
                                                <div style={{ display: 'flex' }}>
                                                    <PeopleOutline style={styles.icon} />
                                                    <Typography style={styles.itemText} >{player}/{ready}</Typography>
                                                    <Stop style={{ ...styles.icon, color: ready != player ? green[500] : pink[500], transform: 'rotate(45deg)' }} />
                                                </div>
                                            } />
                                            <ListItemText style={styles.listItem} primary={
                                                <>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <ArrowRight style={{ color: 'rgb(219, 110, 110)' }} />
                                                        <Typography style={styles.subText} >{toMoney(min)}</Typography>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <ArrowLeft style={{ color: 'rgb(116, 219, 110)' }} />
                                                        <Typography style={styles.subText} >{toMoney(max)}</Typography>
                                                    </div>
                                                </>
                                            } />
                                            <ListItemText style={{ justifyContent: 'flex-end', display: 'flex' }} primary={
                                                ready != player
                                                    ? < Button onClick={() => this.join(room.roomId)} style={{ ...styles.btn, ...styles.start }} >
                                                        {t('start')}
                                                    </Button>
                                                    : < Button onClick={() => this.join(room.roomId)} style={{ ...styles.btn, ...styles.view }} >
                                                        <Visibility style={styles.viewIcon} />
                                                    </Button>
                                            } />
                                        </ListItem>
                                    )
                                }
                                return null;
                            })
                            }
                        </List>
                    </Scrollbars>
                </div>
            </div >
        );
    }
}
const styles = {
    root: {

    },
    text: {
        color: '#eee',
        fontSize: '.7rem',
    },
    item: {
        background: 'rgba(24, 20, 34, 0.3)',
        padding: 0,
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 5
    },
    myTable: {
        background: 'rgba(182, 109, 234, 0.31)'
    },
    inTable: {
        background: 'rgba(109, 113, 234, 0.31)'
    },
    itemText: {
        color: '#eee',
        fontSize: 14,
    },
    xtext: {
        color: 'rgb(176, 176, 176)',
        fontSize: '.7rem',
        marginRight: 10,
        marginLeft: 10,
    },
    subText: {
        color: 'rgb(176, 176, 176)',
        fontSize: 11,
    },
    avatarItem: {
        minWidth: 40
    },
    avatar: {
        width: 30,
        height: 30,
        color: '#eee',
        border: '1px solid #eee',
        backgroundColor: pink[500]
    },
    listItem: {
        color: '#eee',
        width: '30%'
    },
    icon: {
        fontSize: 18,
        color: '#999',
        marginLeft: 4,
        marginRight: 4
    },
    btn: {
        margin: '2 0',
        color: 'rgb(2, 2, 2)',
        padding: 3,
        borderRadius: 30,
        boxShadow: 0
    },
    start: {
        background: 'linear-gradient(0deg, rgb(191, 174, 13) 0%, rgb(189, 156, 12) 100%)'
    },
    view: {
        background: 'linear-gradient(0deg, #514673 0%, #453b66 100%)'
    },
    viewIcon: {
        fontSize: 18,
        color: '#eee',
    },
}
export default ListTable;