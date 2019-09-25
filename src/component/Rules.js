import React, { Component } from 'react';
import Slider from '@material-ui/core/Slider';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import IconButton from '@material-ui/core/IconButton';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Check from '@material-ui/icons/Check';
import autoBind from 'react-autobind';
import Context from '../library/Context';
import { toMoney } from '../library/Helper';
import ToolTip from 'react-portal-tooltip';
import { t } from '../locales'

const iOSBoxShadow =
    '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
const IOSSlider = withStyles({
    root: {
        color: '#3880ff',
        height: 2,
        padding: '25px 0',
        margin: '10px 17% 0 0',
        width: '80%'
    },
    thumb: {
        height: 28,
        width: 28,
        backgroundColor: '#fff',
        boxShadow: iOSBoxShadow,
        marginTop: -14,
        '&:focus,&:hover,&$active': {
            boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                boxShadow: iOSBoxShadow,
            },
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 11px)',
        top: -22,
        '& *': {
            background: 'transparent',
            color: '#fff',
        },
    },
    track: {
        height: 2,
    },
    rail: {
        height: 2,
        opacity: 0.5,
        backgroundColor: '#bfbfbf',
    },
    mark: {
        backgroundColor: '#bfbfbf',
        height: 8,
        width: 1,
        marginTop: -3,
    },
    markActive: {
        backgroundColor: 'currentColor',
    },
})(Slider);

class Rules extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props);
        this.state = {
            bet: context.state.table.min,
            type: '',
            showRules: false,
            mySit: 0,
        };
        this.timer = null;
        autoBind(this);
    }
    reset() {
        this.setState({
            showRules: false,
        });
    }
    mySit(mySit) {
        this.setState({ mySit })
    }
    changeBet(e, bet) {
        this.setState({ bet })
    }
    changeType(e, type) {
        this.setState({ type })
    }
    componentDidMount() {
        this.context.game.register('rules', this.showRules);
        this.context.game.register('mySit', this.mySit);
        this.context.game.register('reset', this.reset);
    }
    showRules(id) {
        if (this.state.mySit == id) {
            clearTimeout(this.timer);
            this.setState({ showRules: true, type: '' })
            this.timer = setTimeout(() => {
                this.setState({ showRules: false })
            }, this.context.state.setting.timer);
        }
    }
    valuetext(value) {
        return toMoney(value);
    }
    done() {
        const { bet, type } = this.state;
        this.context.game.send({ rules: { bet, type } })
        this.setState({ showRules: false })
    }
    cancel() {
    }
    render() {
        return (
            <ToolTip useHover={false} tooltipTimeout={0} active={this.state.showRules && this.context.state.started} position="top" arrow="center" style={tooltip} parent="#mysit">
                <div style={{ ...styles.root, direction: this.context.state.dir }}>
                    {this.state.type == ''
                        ? <>
                            <FormLabel style={styles.legend} component="legend">{t('winner')}</FormLabel>
                            <RadioGroup
                                aria-label="gender"
                                name="type"
                                value={this.state.type}
                                onChange={this.changeType}
                                row
                            >
                                <FormControlLabel style={styles.label} value="max" control={<Radio style={styles.radio} />} label={t('max')} />
                                <FormControlLabel style={styles.label} value="min" control={<Radio style={styles.radio} />} label={t('min')} />
                            </RadioGroup>
                        </>
                        : <>
                            <FormLabel style={styles.legend} component="legend">{t('amount')}</FormLabel>
                            <IOSSlider
                                value={this.state.bet}
                                onChange={this.changeBet}
                                valueLabelDisplay="on"
                                aria-labelledby="range-slider"
                                min={this.context.state.table.min}
                                max={this.context.state.balance > this.context.state.table.max ? this.context.state.table.max : this.context.state.balance}
                                step={this.context.state.setting.step}
                                valueLabelFormat={this.valuetext}
                            />
                            <IconButton onClick={this.done} color="secondary" style={styles.done}>
                                <Check />
                            </IconButton>
                        </>
                    }
                </div>
            </ToolTip>
        );
    }
}
let theme = createMuiTheme()
let tooltip = {
    style: {
        background: 'rgb(28, 24, 40)',
        padding: '10px 20px 10px 20px',
        marginTop: 50,
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)'
    },
    arrowStyle: {
        color: 'rgb(28, 24, 40)',
        borderColor: false
    }
}
const styles = {
    root: {
        width: theme.spacing(35),
    },
    radio: {
        color: 'rgb(233, 30, 99)',
    },
    label: {
        color: '#eee',
        fontSize: '.8rem'
    },
    legend: {
        color: 'rgb(147, 147, 147)',
        borderBottom: '1px solid rgb(66, 63, 63)',
        textAlign: 'center',
        paddingBottom: 10,
        marginBottom: 20,
    },
    done: {
        position: 'absolute',
        right: 0,
        bottom: 22
    }
}
export default Rules;