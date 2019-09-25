import React, { Component } from 'react';
import autoBind from 'react-autobind';
import SwipeableViews from 'react-swipeable-views';
import Table from './component/Table';
import Chat from './component/chat/Chat';
import List from './component/List';
import Info from './component/Info';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { t } from './locales';
import { withStyles } from '@material-ui/core/styles';
import Context from './library/Context';

import ZokerName from './assets/img/zokerName.png';
import ZokerLogo from './assets/img/zokerLogo.png';

const StyledTabs = withStyles({
  root: {
    overFlow: 'hidden',
    borderRadius: 10,
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: '#fff',
    fontSize: theme.typography.pxToRem(13),
    minWidth: 30,
    backgroundColor: '#17141f',
    '&:focus': {
      opacity: 1,
      backgroundColor: 'transparent',
    },
    '&$selected': {
      backgroundColor: 'transparent',
    }
  },
  selected: {}
}))(props => <Tab disableRipple {...props} />);


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Typography style={{ height: '100%' }} component="div" role="tabpanel" hidden={value !== index} {...other}>
      {children}
    </Typography>
  );
}

class Route extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      list: 0,
      chat: 0,
      mobile: 2,
      connected: false
    };
    autoBind(this);
  }
  componentDidMount() {
    this.context.game.register('welcome', this.connected);
    this.context.game.register('leave', this.leave);
  }
  connected() {
    setTimeout(() => {
      this.setState({ connected: true, mobile: 1, chat: 1 })
    }, 200);
  }
  leave() {
    this.setState({ connected: false, mobile: 2, chat: 0 })
  }
  handleChangeList(e, list) {
    this.setState({ list })
  }
  list() {
    return (
      <div style={{ ...styles.root }} >
        <StyledTabs
          variant="fullWidth"
          value={this.state.list}
          onChange={this.handleChangeList}
        >
          <StyledTab label={t('tables')} />
          <StyledTab label={t('tournament')} disabled />
        </StyledTabs>
        <TabPanel value={this.state.list} index={0}>
          <List />
        </TabPanel>
        <TabPanel value={this.state.list} index={1}>

        </TabPanel>
      </div>
    )
  }
  handleChangeChat(e, chat) {
    this.setState({ chat })
  }
  chats() {
    return (
      <div style={{ ...styles.root }} >
        <StyledTabs
          variant="fullWidth"
          value={this.state.chat}
          onChange={this.handleChangeChat}
        >
          <StyledTab label={t('publicChat')} />
          <StyledTab label={t('inGameChat')} disabled={!this.state.connected} />
        </StyledTabs>
        <TabPanel value={this.state.chat} index={0}>
          <Chat load="messages" server="lobby" />
        </TabPanel>
        <TabPanel value={this.state.chat} index={1}>
          <Chat load="message" server="game" />
        </TabPanel>
      </div>
    )
  }
  table() {
    return (
      <>
        <div style={styles.logo} >
          <img style={styles.img} src={ZokerLogo} />
          <img style={styles.img} src={ZokerName} />
        </div>
        {this.state.connected &&
          <Table />
        }
      </>
    )
  }
  render() {
    if (this.context.state.isMobile)
      return (
        <SwipeableViews index={this.state.mobile} enableMouseEvents slideStyle={{ width: '100vw', height: '100vh' }}>
          <div style={{ ...styles.mdir, direction: this.context.state.dir }} >
            {this.chats()}
          </div>
          <div style={{ ...styles.mdir, direction: this.context.state.dir }} >
            {this.table()}
          </div>
          <div style={{ ...styles.mdir, direction: this.context.state.dir }} >
            {this.list()}
          </div>
        </SwipeableViews>
      )
    return (
      <Grid container style={styles.root} >
        <Grid xs={4} style={styles.dir} container>
          {this.list()}
        </Grid>
        <Grid xs={5} style={{ ...styles.dir, marginLeft: 0, marginRight: 0 }} container>
          {this.table()}
        </Grid>
        <Grid style={{ margin: 10 }} xs={3} container direction="column" >
          <Grid container xs={12} style={{ ...styles.xdir, flex: .2, marginBottom: 10 }} justify="space-between" direction="column" alignItems="center" >
            <Info />
          </Grid>
          <Grid container xs={12} style={{ ...styles.xdir, flex: .8 }} >
            {this.chats()}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
const styles = {
  root: {
    flexGrow: 1,
  },
  mdir: {
    display: 'flex',
    flex: 1,
    backgroundImage: 'radial-gradient(#565362,#221d31)',
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  },
  dir: {
    display: 'flex',
    flex: .9,
    backgroundImage: 'radial-gradient(#312c43,#221d31)',
    margin: 10,
    borderRadius: 10,
    position: 'relative',
  },
  xdir: {
    display: 'flex',
    backgroundImage: 'radial-gradient(#312c43,#221d31)',
    borderRadius: 10,
    position: 'relative',
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    opacity: 1,
    position: 'absolute',
    alignSelf: 'center',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  img: {
    width: 70,
    margin: 3
  }
}
export default Route;