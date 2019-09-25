import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import Context from '../library/Context';

export default class Timer extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            completed: 0,
        };
        this.step = 10 / (props.time / 1000);
    }

    componentDidMount() {
        this.progress(1);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    progress(completed) {
        if (completed > 100) {
            this.setState({ completed: 100 });
        } else {
            this.setState({ completed });
            this.timer = setTimeout(() => this.progress(completed + this.step), 100);
        }
    }

    render() {
        if (!this.context.state.started) {
            return null;
        }
        if ('border' in this.props) {
            if (this.state.completed == 100)
                return null;
            return (
                <CircularProgress style={styles.progress} thickness={3} mode="determinate" color="secondary" variant="determinate" value={this.state.completed} />
            )
        }
        return (
            <LinearProgress mode="determinate" thickness={3} color="secondary" variant="determinate" value={this.state.completed} />
        );
    }
}

const styles = {
    root: {
        flexGrow: 1,
        width: '100%',
        height: 5
    },
    progress: {
        width: 50,
        height: 50,
        position: 'absolute',
        zIndex: 9
    },
};

