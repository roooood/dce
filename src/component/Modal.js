import React from 'react';
import autoBind from 'react-autobind';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Context from '../library/Context';
import Timer from './Timer';

import { t } from '../locales'

class Modal extends React.Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            title: null,
            component: null
        };
        this.component = null;
        autoBind(this);
    }
    hide() {
        this.setState({ open: false, component: null })
        if (this.component != null)
            this.component.cancel();
    }
    show(component, title = null) {
        this.setState({ open: true, component, title })
    }
    callBack() {
        this.hide();
        this.component.done();
    }
    render() {
        if (this.state.component == null)
            return null;
        return (
            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={this.state.open}
            // onClose={this.hide}
            >
                <DialogTitle id="max-width-dialog-title">{this.state.title}</DialogTitle>
                <DialogContent>
                    <this.state.component ref={r => this.component = r} />
                    <Timer time={this.context.state.setting.timer} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.hide} color="primary">
                        {t('close')}
                    </Button>
                    <Button onClick={this.callBack} variant="contained" color="primary" >
                        {t('done')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default Modal;