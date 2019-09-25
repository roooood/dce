import React, { Component } from 'react';
import Slider from '@material-ui/core/Slider';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import autoBind from 'react-autobind';
import Context from '../library/Context';
import { toMoney } from '../library/Helper';
import { t } from '../locales';

const iOSBoxShadow =
    '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
const IOSSlider = withStyles({
    root: {
        color: '#3880ff',
        height: 2,
        padding: '20px 0 5px 0',
        width: '85%'
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
            color: '#000',
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

class Create extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props);
        this.state = {
            open: false,
            title: '',
            player: '4',
            bet: [0, 100],
        };
        autoBind(this);
    }
    changeBet(e, bet) {
        this.setState({ bet })
    }
    changeTitle(e, title) {
        this.setState({ title: e.target.value })
    }
    changeType(e, type) {
        this.setState({ type })
    }
    changePlayer(e, player) {
        this.setState({ player })
    }
    componentDidMount() {

    }
    valuetext(value) {
        return toMoney(value);
    }
    done() {
        const { title, player, bet: [min, max] } = this.state;
        const key = this.context.state.userKey;
        this.context.game.join('dice', { create: true, key, title, player, min, max });
        this.hide();
    }
    hide() {
        this.setState({ open: false })
    }
    show() {
        this.setState({
            open: true,
            title: t('table') + ' ' + Math.floor(Math.random() * 100),
            bet: [this.context.state.setting.minbet, this.context.state.balance]
        })
    }
    render() {
        return (
            <div style={styles.root}>
                <Dialog
                    fullWidth={true}
                    maxWidth={'xs'}
                    open={this.state.open}
                    onClose={this.hide}
                >
                    <DialogTitle>{t('createTable')}</DialogTitle>
                    <DialogContent style={{ padding: '8px 10px' }}>
                        <Grid container style={{}}>
                            <Grid xs={4} container alignItems="center">
                                <FormLabel style={styles.label} component="legend">{t('tableName')}</FormLabel>
                            </Grid>
                            <Grid xs={8}>
                                <Input
                                    value={this.state.title}
                                    onChange={this.changeTitle}
                                    style={{ width: '100%' }}
                                    inputProps={{
                                        'aria-label': 'description',
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container style={styles.form}>
                            <Grid xs={4} container alignItems="center">
                                <FormLabel style={styles.label} component="legend">{t('players')}</FormLabel>
                            </Grid>
                            <Grid xs={8}>
                                <RadioGroup
                                    aria-label="player"
                                    name="player"
                                    value={this.state.player}
                                    onChange={this.changePlayer}
                                    row
                                >
                                    <FormControlLabel value={'2'} control={<Radio style={{ padding: 3 }} color="primary" />} label={"2"} />
                                    <FormControlLabel value={'4'} control={<Radio style={{ padding: 3 }} color="primary" />} label={"4"} />
                                    <FormControlLabel value={'6'} control={<Radio style={{ padding: 3 }} color="primary" />} label={"6"} />
                                    <FormControlLabel value={'8'} control={<Radio style={{ padding: 3 }} color="primary" />} label={"8"} />
                                </RadioGroup>
                            </Grid>
                        </Grid>
                        <Grid container style={styles.form}>
                            <Grid xs={4} container alignItems="center">
                                <FormLabel style={styles.label} component="legend">{t('rangeBet')}</FormLabel>
                            </Grid>
                            <Grid xs={8} style={{ marginTop: 10 }}>
                                <IOSSlider
                                    value={this.state.bet}
                                    onChange={this.changeBet}
                                    valueLabelDisplay="on"
                                    aria-labelledby="range-slider"
                                    min={this.context.state.setting.minbet}
                                    max={this.context.state.balance}
                                    step={this.context.state.setting.step}
                                    valueLabelFormat={this.valuetext}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.hide} color="primary">
                            {t('close')}
                        </Button>
                        <Button onClick={this.done} variant="contained" color="primary" >
                            {t('create')}
                        </Button>
                    </DialogActions>
                </Dialog>


            </div >
        );
    }
}
let theme = createMuiTheme()
const styles = {
    label: {
        fontSize: '.8rem'
    },
    formControl: {
        display: 'flex',
        flex: 1,
        marginTop: 20
    },
    form: {
        marginTop: 20,
        marginBottom: 20
    }
}
export default Create;