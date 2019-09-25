import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import autoBind from 'react-autobind';
import Context from '../library/Context';
import { toMoney } from '../library/Helper';
import { t } from '../locales'


class Confirm extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {};
        autoBind(this);
    }

    componentDidMount() {

    }
    done() {
        this.context.game.send({ imReady: true })
    }
    cancel() {
        this.context.game.send({ imReady: false })
    }
    render() {
        return (
            <Grid container style={styles.root}>
                <Grid item xs={6}>
                    <Typography display="inline">{t('amount')}</Typography>
                    <Typography display="inline" style={styles.info}>{toMoney(this.context.state.rules.bet)}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography display="inline">{t('winner')}</Typography>
                    <Typography display="inline" style={styles.info}>{t(this.context.state.rules.type)}</Typography>
                </Grid>
                <Grid item xs={12} style={{ marginTop: 30 }}>
                    {t('confirmRules')}
                </Grid>
            </Grid>
        );
    }
}
const styles = {
    root: {
        marginTop: 20,
        marginBottom: 30
    },
    info: {
        marginRight: 10,
        marginLeft: 10,
        fontWeight: 'bold',
    }
}

export default Confirm;