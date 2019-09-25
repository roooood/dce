
import React, { Component } from 'react';
import Dice from './dice/Dice';
import Context from '../library/Context';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { createMuiTheme } from '@material-ui/core/styles';
import { green, pink } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import autoBind from 'react-autobind';
import PersonAdd from '@material-ui/icons/PersonAdd';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Timer from './Timer';
import { toMoney, getOffset } from '../library/Helper';
import { t } from '../locales';
import play from './Sound';


class Item extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            timer: false,
            rolling: false,
            mySit: 0,
            winner: [],
            loser: []
        };
        this.imManager = false;
        this.dir = {
            start: 'row',
            up: 'column',
            down: 'column-reverse',
            end: 'row-reverse'
        }
        this.timer = null;
        autoBind(this);
    }
    reset() {
        this.setState({
            timer: false,
            rolling: false,
            winner: [],
            loser: []
        });
    }
    roll(type) {
        if (type)
            play('roll')
        this.setState({ rolling: false });
        clearTimeout(this.timer)
        this.context.game.send({ roll: type });
        // let cls = type ? 'roll': 'hold';
        // let el = document.querySelector('.'+ cls);
        // el.classList.add('slide-out-blurred-top');
        // setTimeout(() => {
        //    this.setState({ rolling: false });
        // }, 500);

    }
    componentDidMount() {
        this.context.game.register('rules', this.showManager);
        this.context.game.register('roll', this.showRoll);
        this.context.game.register('mySit', this.mySit);
        this.context.game.register('result', this.result);
        this.context.game.register('company', this.company);
        this.context.game.register('reset', this.reset);
    }
    manager() {

    }
    showRoll() {
        this.hideTimer();
        clearTimeout(this.timer)
        setTimeout(() => {
            this.setState({ rolling: true });
        }, 500);
        this.timer = setTimeout(() => {
            this.setState({ rolling: false });
        }, this.context.state.setting.timer + 1000);

    }
    showTimer() {
        this.setState({ timer: true });
    }
    hideTimer() {
        this.setState({ timer: false });
    }
    showManager(id) {
        this.imManager = false;
        this.setState({
            winner: [],
            loser: [],
            timer: false,
            rolling: false,
        });
        if (this.state.mySit == id) {
            this.imManager = true;
        }
        if (this.props.sit == id) {
            this.showTimer();
        }
    }
    sit() {
        this.context.game.send({ sit: this.props.sit })
    }
    company(sit) {
        if (this.props.sit == sit) {
            this.move(sit)
        }
    }
    move(sit) {
        let sr = 'sit' + sit;
        let ds = 'dest';
        let el = document.querySelector('.' + sr);
        let dl = document.querySelector('.' + ds);
        if (dl) {
            dl = dl.parentElement
            let spos = getOffset(el);
            let dpos = getOffset(dl);
            let cl = el.cloneNode(true);
            document.body.appendChild(cl);
            cl.classList.remove(sr);
            cl.classList.add('moving');
            cl.setAttribute("style", 'position: absolute;left:' + spos.left + 'px;top:' + spos.top + 'px;');
            setTimeout(() => {
                cl.classList.add('blur-out-contract-bck');
                cl.style.left = dpos.left + 10 + 'px';
                cl.style.top = dpos.top + 'px';
            }, 100);
        }
    }
    mySit(mySit) {
        this.setState({
            mySit,
            timer: false,
            rolling: false,
        })
    }
    result(res) {
        let winner = res.win;
        let loser = res.lose;
        this.setState({ winner, loser, rolling: false });
        setTimeout(() => {
            this.setState({ winner: [], loser: [] });
        }, 4900)
    }
    render() {
        const { align, sit } = this.props;
        const { winner, loser } = this.state;
        const { players } = this.context.state;
        if (players != undefined) {
            if (sit in players) {
                return (
                    <Grid className="scale-in-center" style={styles.box} container direction={this.dir[align]} alignItems="center" wrap="nowrap" >
                        <Grid item style={{ ...styles.info, opacity: (loser.includes(sit) || (('dice' in players[sit]) && players[sit].dice == null)) ? .5 : 1 }}>
                            <Typography className="focus-in-expand" style={styles.name}>{players[sit].name}</Typography>
                            <div style={styles.dAvatar} className={winner.includes(sit) ? "pulsate-fwd" : ""}>
                                {(this.state.timer || (this.state.rolling && !('dice' in players[sit]))) &&
                                    <Timer border time={this.context.state.setting.timer + 1000} />
                                }
                                <Avatar style={{ ...styles.avatar, backgroundColor: green[500] }} >
                                    {players[sit].name[0].toUpperCase()}
                                </Avatar>
                            </div>
                            {(('rules' in this.context.state && 'bet' in this.context.state.rules))
                                ? <Box display="flex" alignItems="center" className="focus-in-expand">
                                    <AttachMoney style={styles.money} />
                                    <Typography className={"sit" + sit}>{toMoney(this.context.state.rules.bet)}</Typography>
                                </Box>
                                : <Box display="flex" alignItems="center">
                                    <Typography >&nbsp;</Typography>
                                </Box>
                            }
                        </Grid>
                        {this.context.state.started &&
                            <Grid item style={{ ...styles.content, opacity: loser.includes(sit) ? .5 : 1 }}>
                                {(this.state.rolling && !('dice' in players[sit]) && this.state.mySit == sit) &&
                                    <>
                                        <Button className="roll" onClick={() => this.roll(true)} style={{ ...styles.btn, ...styles.roll }}  >
                                            {t('roll')}
                                        </Button>
                                        {!this.imManager &&
                                            <Button className="hold" onClick={() => this.roll(false)} style={{ ...styles.btn, ...styles.hold }} >
                                                {t('hold')}
                                            </Button>
                                        }
                                    </>
                                }
                                {(('dice' in players[sit]) && players[sit].dice == null)
                                    ?
                                    <Button style={{ ...styles.btn, ...styles.hold }} >
                                        {t('hold')}
                                    </Button>
                                    :
                                    <Dice number={players[sit].dice} />

                                }
                            </Grid>
                        }
                    </Grid >
                )
            }
        }
        return (
            <Grid className="scale-in-center" style={styles.box} container direction={this.dir[align]} alignItems="center" wrap="nowrap" >
                <Grid item style={styles.info}>
                    <Typography style={styles.name}>&nbsp;</Typography>
                    <Avatar style={{ ...styles.avatar, backgroundColor: pink[500] }} onClick={this.sit}>
                        <PersonAdd />
                    </Avatar>
                    <Box display="flex" alignItems="center">
                        <Typography  >&nbsp;</Typography>
                    </Box>
                </Grid>
                <Grid item style={styles.content} >

                </Grid>
            </Grid >
        );
    }
}

let theme = createMuiTheme()
const styles = {
    box: {
        color: '#ddd'
    },
    name: {
        width: 85,
        textAlign: 'center',
        overflow: 'hidden',
        direction: 'ltr',
        textOverflow: 'ellipsis'
    },
    dAvatar: {
        position: 'relative'
    },
    avatar: {
        width: 50,
        height: 50,
        color: '#eee',
        border: '2px solid #eee',
        cursor: 'pointer',
    },
    money: {
        color: '#fff',
        background: 'rgb(227, 133, 7)',
        borderRadius: '50%',
        border: '2px solid rgb(242, 242, 13)',
        fontSize: 18,
        margin: 4
    },
    moneyText: {
        color: '#fff'
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(.5),
    },
    content: {
        display: 'flex',
        height: theme.spacing(8),
        width: theme.spacing(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        margin: theme.spacing(.5),
        color: '#fff',
        padding: 3,
        borderRadius: 30,
        boxShadow: 0
    },
    hold: {
        background: 'linear-gradient(0deg, rgba(229, 33, 17, 1) 0%, rgba(214, 7, 77, 1) 100%)'
    },
    roll: {
        background: 'linear-gradient(0deg, rgb(79, 157, 70) 0%, rgb(22, 189, 20) 100%)'
    }
}

export default Item;