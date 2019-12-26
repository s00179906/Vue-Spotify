import axios from 'axios';

const state = {
  user: null,
  userLoggedIn: localStorage.getItem('userIsLogginIn'),
  userLibraryTracks: null,
  categories: null,
  userRedirectedFromSpotify: false,
  userPlaylists: []
};

const getters = {
  user: state => state.user,
  userName: state => state.user.display_name
};

const actions = {
  login() {
    localStorage.setItem('userIsLogginIn', true);
    window.location.href = 'https://auth-spotify-api.herokuapp.com/login';
  },
  setTokens() {
    const access_token_Start = window.location.href.indexOf('=');
    const access_token_End = window.location.href.indexOf('&');
    const access_token = window.location.href.slice(
      access_token_Start + 1,
      access_token_End
    );

    const refresh_token_Start = window.location.href.indexOf(
      '=',
      access_token_Start + 1
    );
    const refresh_token = window.location.href.slice(refresh_token_Start + 1);

    const tokens = {
      access_token,
      refresh_token
    };

    localStorage.setItem('tokens', JSON.stringify(tokens));
  },
  async getAuthUser({ commit }) {
    const { access_token } = await JSON.parse(localStorage.getItem('tokens'));

    if (access_token) {
      const user = await axios
        .get('https://api.spotify.com/v1/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`
          }
        })
        .then(res => console.log(res))
        .catch(error => console.log(error));

      commit('setAuthUser', user.data);
    }
  },
  async getUserLibraryTracks({ commit }) {
    const { access_token } = await JSON.parse(localStorage.getItem('tokens'));

    if (access_token) {
      const tracks = await axios.get(
        'https://api.spotify.com/v1/me/tracks?limit=10',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`
          }
        }
      );

      commit('setUserLibraryTracks', tracks.data.items);
    }
  },
  async getAllCategories({ commit }) {
    const { access_token } = await JSON.parse(localStorage.getItem('tokens'));

    if (access_token) {
      const categories = await axios.get(
        'https://api.spotify.com/v1/browse/categories',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`
          }
        }
      );

      commit('setCategories', categories.data.categories.items);
      console.log('CATEGORIES state', state.categories);
    }
  },
  setSpotifyRedirect({ commit }) {
    commit('setUserRedirectedFromSpotify', true);
  },
  async getUserPlaylists({ commit }) {
    const { access_token } = await JSON.parse(localStorage.getItem('tokens'));

    if (access_token) {
      const playlists = await axios.get(
        'https://api.spotify.com/v1/me/playlists',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`
          }
        }
      );

      commit('setUserPlaylists', playlists.data.items);

      console.log('USER PLAYLISTS -->', state.userPlaylists);
    }
  }
};

const mutations = {
  setAuthUser: (state, user) => (state.user = user),
  setUserLoggedIn_m: (state, value) => (state.userLoggedIn = value),
  setUserLibraryTracks: (state, tracks) => (state.userLibraryTracks = tracks),
  setCategories: (state, categories) => (state.categories = categories),
  setUserRedirectedFromSpotify: (state, value) =>
    (state.userRedirectedFromSpotify = value),
  setUserPlaylists: (state, playlists) => (state.userPlaylists = playlists)
};

export default {
  state,
  getters,
  actions,
  mutations
};
