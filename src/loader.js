import React, {Component} from 'react';

const loadingDefault = () => {
  return <div>LOADING</div>;
};

const Loader = (loader, args, loading, callback) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loaded: false,
        mod: false,
      };
    }

    async load() {
      if (!this.state.loaded) {
        try {
          const mod = await loader();
          let k = mod;
          if (mod.default) {
            k = mod.default;
          }
          this.setState({
            loaded: true,
            mod: k,
          });
        } catch (err) {
          console.error(err);
        }
      }
    }

    componentWillMount() {
      this.load();
    }

    render() {
      const {loaded, mod} = this.state;
      if (loaded) {
        return (
          (callback && callback(mod, this.props)) ||
          React.createElement(mod, Object.assign({}, this.props, args))
        );
      }
      return (loading && loading()) || loadingDefault();
    }
  };
};

export default Loader;
