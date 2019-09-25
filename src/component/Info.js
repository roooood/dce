import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Context from '../library/Context';
import { toMoney, amountLen, isFloat, add, getQuery } from '../library/Helper';
import { t } from '../locales';
import CountUp from 'react-countup';
import autoBind from 'react-autobind';

class Info extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: 0,
            balance: false,
        };
        this.back = getQuery('ref');
        autoBind(this)
    }
    componentDidMount() {
        this.context.game.register('balance', this.balance);
    }
    balance(value) {
        const [balance, amount] = value;
        let end = add(balance, amount);
        this.context.setState({ balance: end });
        this.setState({
            balance: true,
            start: balance,
            end: end
        })
    }
    render() {
        let start = 0, end = 0;
        const { balance } = this.state;
        if (('id' in this.context.state)) {
            start = balance ? balance : this.context.state.balance
            end = balance ? balance : this.context.state.balance
        }

        if (this.context.state.isMobile)
            return (
                <Typography variant="h5" style={styles.mobileText}>
                    {('id' in this.context.state)
                        ? balance
                            ? <CountUp
                                start={this.state.start}
                                end={this.state.end}
                                decimals={amountLen(this.state.end)}
                                {...(isFloat(this.state.end) ? undefined : { formattingFn: e => toMoney(e) })}
                            />
                            : <CountUp
                                start={0}
                                end={this.context.state.balance}
                                decimals={amountLen(this.context.state.balance)}
                                {...(isFloat(this.context.state.balance) ? undefined : { formattingFn: e => toMoney(e) })}
                            />

                        : '-'
                    }
                </Typography>
            );

        return (
            <>
                {this.back &&
                    <a href={this.back} className="back">{t('return')}</a>
                }
                <Typography variant="h4" style={styles.text}>
                    {('id' in this.context.state)
                        ? balance
                            ? <CountUp
                                start={this.state.start}
                                end={this.state.end}
                                decimals={amountLen(this.state.end)}
                                {...(isFloat(this.state.end) ? undefined : { formattingFn: e => toMoney(e) })}
                            />
                            : <CountUp
                                start={0}
                                end={this.context.state.balance}
                                decimals={amountLen(this.context.state.balance)}
                                {...(isFloat(this.context.state.balance) ? undefined : { formattingFn: e => toMoney(e) })}
                            />

                        : '-'
                    }
                </Typography>
                <Typography style={styles.xtext}>{('id' in this.context.state) ? this.context.state.name : t('guest')}</Typography>
            </>
        );
    }
}
const styles = {
    text: {
        color: 'rgb(193, 240, 140)',
        marginTop: '11%'
    },
    xtext: {
        color: '#eee',
        background: 'rgba(0,0,0,.1)',
        width: '100%',
        textAlign: 'center',
        padding: 5,
        fontSize: 13
    },
    mobileText: {
        color: '#eee',
        padding: 10
    },
}
export default Info;