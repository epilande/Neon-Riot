import React from 'react'
import { bindActionCreators } from 'redux'
import withRedux from 'next-redux-wrapper'
import Head from 'next/head'
import { initStore } from '../lib/store'
import * as Actions from '../lib/actions';
import { Layer } from '../lib/constants';
import Seed from '../lib/Seed';
import Loading from '../components/Loading';

const Styles = () => (
  <style jsx>{`
    body {
      background-color: #000;
      background-image: url(http://api.thumbr.it/whitenoise-100x100.png?background=00000000&noise=555555&density=14&opacity=40);
      font-family: 'Montserrat', sans-serif;
    }
    #container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    svg {
      position: absolute;
    }
    .layer-bg{
      z-index: 6;
    }
    .layer-horizon{
      z-index: 5;
    }
    .layer-floor{
      z-index: 4;
    }
    .layer-tertiary{
      z-index: 3;
    }
    .layer-secondary{
      z-index: 2;
    }
    .layer-primary{
      z-index: 1;
    }
    .inputContainer {
      background: #000;
      color: #666;
      border: 1px solid #333;
      border-right: 0;
      position: absolute;
      top: 0;
      right: 0;
    }
    .inputLabel {
      display: block;
      margin: 30px 35px;
    }
    .inputLabel p {
      font-weight: 500;
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .inputLabel input {
      padding: 8px 12px;
      background: #000;
      color: #FF00FF;
      text-shadow: 0 0 10px #FF00FF;
      font-family: 'Montserrat', sans-serif;
      font-size: 18px;
      font-weight: 600;
      outline: 0;
      letter-spacing: 1px;
      border: 1px solid #666;
    }
    .center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `}</style>
)

class NeonRiot extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    const { actions } = this.props;
    actions.getWindowSize();
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  handleChange(event) {
    const { actions } = this.props;
    const { value } = event.target;

    actions.updateInput(value);
  }

  render () {
    const { windowSize, input } = this.props;

    const seed = Seed( input );
    // map the seed value to screen y value
    seed.horizonY = ( seed.horizonY / 100 ) * windowSize.height;

    const setPropsFor = className => ({
      windowSize,
      className,
      seed
    });

    const BG = seed.bg.shape;
    const Floor = seed.floor.shape;
    const Horizon = seed.horizon.shape;
    const Tertiary = seed.tertiary.shape;
    const Secondary = seed.secondary.shape;
    const Primary = seed.primary.shape;

    let content = <Loading className="center" />;
    if (windowSize.width !== 0) {
      content = (
        <div>
          <svg id="container" mask="url(#radialMask)">
            <defs>
              <filter id="radialMaskFilter">
                <feGaussianBlur stdDeviation="100"/>
              </filter>
              <mask id="radialMask">
                <ellipse cx="50%" cy="40%" rx="125%" ry="50%" fill="white" filter="url(#radialMaskFilter)" />
              </mask>
            </defs>

            <BG { ...setPropsFor('layer-bg') } />
            <Floor { ...setPropsFor('layer-floor') } />
            <Horizon { ...setPropsFor('layer-horizon') } />
            <Tertiary { ...setPropsFor('layer-tertiary') } layer={ Layer.TERTIARY } />
            <Secondary { ...setPropsFor('layer-secondary') } layer={ Layer.SECONDARY } />
            <Primary { ...setPropsFor('layer-primary') } />
          </svg>

          <div className="inputContainer">
            <label className="inputLabel">
              <p>Enter Some Text</p>
              <input type="text" onChange={this.handleChange} value={input} />
            </label>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Montserrat:500,600" rel="stylesheet" />
        </Head>

        {content}

        <Styles />
      </div>
    )
  }
}

export function mapStateToProps(state) {
  return state;
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(NeonRiot)
