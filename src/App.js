import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Route from './Route';
import CssBaseline from '@material-ui/core/CssBaseline';
import GameServer from './library/Game';
import { getQuery } from './library/Helper';
import Context from './library/Context';
import Snack from './component/Snack';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { createMuiTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { t } from './locales';
import './assets/css/app.css';
const api = window.location.protocol + '//localhost:2657/';
const theme = createMuiTheme({ direction: "rtl" });
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const lang = getQuery('lang') || 'fa';
const dir = lang == 'fa' ? 'rtl' : 'ltr'
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userKey: getQuery('token') || '-',
      dir: dir,
      isMobile: window.innerWidth < 1000
    };
    this.alert = null;
    this.game = new GameServer('dice');
    this.lobby = new GameServer('dice-chat');
    autoBind(this);
  }
  componentDidMount() {
    this.game.reset();
    this.lobby.register('welcome', this.chating);
    this.game.register('welcome', this.connected);
    this.getData();
    this.connectToGame();
    this.connectToLobby();

    let b = document.getElementsByTagName("body")[0]
    b.setAttribute("dir", this.state.dir);
  }
  getData() {
    fetch(api + 'info/' + this.state.userKey, { method: 'GET' })
      .then(response => response.json())
      .then(res => {
        if ('result' in res) {
          if (res.result == 'ok') {
            this.setState({ ...res.data, setting: res.setting });
          }
          else if (res.result == 'no') {
            this.alert.show({ message: t('userError'), type: 'warning' });
            this.setState({ setting: res.setting });
          }
        }
        else {
          this.alert.show({ message: t('networkError'), type: 'error' });
        }
      });
  }
  connectToLobby() {
    if (!this.lobby.isConnect) {
      this.lobby.connect(
        () => {
          this.lobby.getAvailableRooms((rooms) => {
            if (rooms.length > 0) {
              this.lobby.join(rooms[0].roomId, { key: this.state.userKey });
            }
            else {
              this.lobby.join('dice-chat', { create: true, key: this.state.userKey });
            }
          });
        },
        () => setTimeout(() => { this.connectToLobby() }, 5000)
      );
    }
  }
  connectToGame() {
    if (!this.game.isConnect) {
      this.game.connect(
        () => {
          let roomid = localStorage.getItem('roomId');
          if (roomid != null) {
            let item;
            this.game.getAvailableRooms((rooms) => {
              for (item of rooms) {
                if (item.roomId == roomid) {
                  this.game.join(item.roomId, { key: this.state.userKey });
                  break;
                }
              }
            });
          }
        },
        () => setTimeout(() => { this.connectToGame() }, 5000)
      );
    }
  }
  chating() {
    this.lobby.onState((state) => {
      this.setState(state);
    });
  }
  connected(data) {
    this.setState({ table: data });
    this.game.onState((state) => {
      this.setState(state);
    });
  }
  changeState(obj) {
    this.setState(obj)
  }
  app(obj) {
    return this[obj];
  }
  render() {
    return (
      <div dir={dir} style={{ width: '100vw', height: '100vh', display: 'flex' }}>
        <Context.Provider value={{ game: this.game, lobby: this.lobby, state: this.state, app: this.app, setState: this.changeState }}>
          <StylesProvider {...(dir == 'rtl' ? { jss: jss } : undefined)}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Snack ref={r => this.alert = r} />
              <Route />
            </ThemeProvider>
          </StylesProvider>
        </Context.Provider>
      </div>
    );
  }
}

export default App;
