import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AccountBalance from '@material-ui/icons/AccountBalance';
import Star from '@material-ui/icons/Star';
import autoBind from 'react-autobind';
import CountUp from 'react-countup';
import Item from './Seat';
import Context from './../library/Context';
import { toMoney, getOffset, amountLen, isFloat, add } from './../library/Helper';
import { t } from './../locales'
import Rules from './Rules';
import play from './Sound';

class Position extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props);
        this.state = {
            sit: context.state.table.player,
            mySit: 0,
            start: 0,
            end: 0,
        };
        autoBind(this);
    }
    componentDidMount() {
        this.context.game.register('mySit', this.mySit);
        this.context.game.register('company', this.company);
        this.context.game.register('result', this.result);
        this.context.game.register('reset', this.reset);

    }
    mySit(mySit) {
        this.setState({ mySit })
    }
    company() {
        setTimeout(() => {
            play('company')
            this.setState({
                start: this.state.end,
                end: add(this.state.end, this.context.state.rules.bet),
            })
        }, 900);
    }
    reset() {
        this.state.start = 0;
        this.state.end = 0;
        // this.setState({
        //     start: 0,
        //     end: 0,
        // })
    }
    result(res) {
        let winer = res.win;
        let sr = 'dest';
        let el = document.querySelector('.' + sr);
        if (el) {
            let spos = getOffset(el);
            el.innerText = '0';
            for (let i of winer) {
                let cl = el.cloneNode(true);
                cl.innerText = toMoney(this.state.end / winer.length)
                document.body.appendChild(cl);
                cl.classList.add('moving');
                cl.setAttribute("style", 'position: absolute;left:' + spos.left + 'px;top:' + spos.top + 'px;');
                (function (cl, sit) {
                    setTimeout(function () {
                        let dl = document.querySelector('.sit' + sit);
                        let dpos = getOffset(dl);
                        cl.classList.add('blur-out-contract-bck');
                        cl.style.left = dpos.left + 'px';
                        cl.style.top = dpos.top + 'px';
                    }, 100);
                })(cl, i);
            }
        }
    }
    render() {
        const { sit, mySit } = this.state;

        let sits = new Array(sit).fill(0).map((e, i) => i + 1);
        let mid = sit / 2;
        let side = new Array(mid - 1).fill(0);
        if (mySit > 0 && this.context.state.started) {
            let tmp = [], start = sits.indexOf(parseInt(mySit));
            for (let i = 0; i < sit; i++) {
                tmp.push(sits[(start + i) % sit])
            }
            sits = tmp;
        }
        return (
            <div style={styles.root}>
                <Grid container justify="space-between">
                    <Grid xs={4} style={styles.sides} container direction="column-reverse" justify="space-around" alignItems="flex-start">
                        {side.map((v, i) => <Item key={i} sit={sits[i + 1]} align="start" />)}
                    </Grid>
                    <Grid xs={3} style={styles.midsides} container direction="column" justify="space-between" alignItems="center">
                        <Item align="up" sit={sits[mid]} />
                        <div>
                            {'rules' in this.context.state && this.context.state.rules.set &&
                                <div className="slide-in-elliptic-top-fwd" style={{ marginTop: -30 }}>
                                    <Box display="flex" style={styles.box} alignItems="center"  >
                                        <AccountBalance style={styles.icon} />
                                        <Typography style={styles.money} className="dest">
                                            {this.state.end > 0
                                                ? <CountUp
                                                    start={this.state.start}
                                                    end={this.state.end}
                                                    decimals={amountLen(this.state.end)}
                                                    {...(isFloat(this.state.end) ? undefined : { formattingFn: e => toMoney(e) })}
                                                />
                                                : 0
                                            }
                                        </Typography>
                                    </Box>
                                    <Box display="flex" style={styles.box} alignItems="center" >
                                        <Star style={styles.icon} />
                                        <Typography style={styles.text}>{t(this.context.state.rules.type)}</Typography>
                                    </Box>
                                </div>
                            }
                        </div>
                        <Rules />
                        <div id="mysit">
                            <Item align="down" sit={sits[0]} />
                        </div>
                    </Grid>
                    <Grid xs={4} style={styles.sides} container direction="column" justify="space-around" alignItems="flex-end">
                        {side.map((v, i) => <Item key={i} sit={sits[i + mid + 1]} align="end" />)}
                    </Grid>
                </Grid>
            </div>
        );
    }
}
let theme = createMuiTheme()

const styles = {
    root: {
        display: 'flex',
        flex: 1,
    },
    sides: {
        paddingTop: theme.spacing(15),
        paddingBottom: theme.spacing(15),
    },
    midsides: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
    },
    box: {
        background: 'rgba(0,0,0,.05)',
        margin: 5,
        borderRadius: 10,
        padding: 5,
        minWidth: 70,
        textAlign: 'center',
    },
    text: {
        fontSize: '.7rem',
        color: '#eee',
    },
    money: {
        fontSize: '.8rem',
        color: '#eee',

    },
    icon: {
        color: 'rgb(247, 224, 7)',
        fontSize: 15,
        margin: 4
    },

}

export default Position;