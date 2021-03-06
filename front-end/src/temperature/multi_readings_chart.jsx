import React from 'react'
import { ResponsiveContainer, Tooltip, YAxis, XAxis, LineChart, Line } from 'recharts'
import { fetchTCUsage } from '../redux/actions/tcs'
import { connect } from 'react-redux'
import i18next from 'i18next'

class chart extends React.Component {

  componentDidMount () {
    this.props.fetch(this.props.sensor_id)
    const timer = window.setInterval(() => { this.props.fetch(this.props.sensor_id) }, 10 * 1000)
    this.setState({ timer: timer })
  }

  componentWillUnmount () {
    if (this.state && this.state.timer) {
      window.clearInterval(this.state.timer)
    }
  }

  render () {

    if (this.props.usage === undefined) {
      return (<div />)
    }
    if (this.props.config === undefined) {
      return (<div />)
    }
    let currentTemp = ''
    if (this.props.usage.current.length > 1) {
      currentTemp = this.props.usage.current[this.props.usage.current.length - 1].value
    }

    return (
      <div className='container'>
        <span className='h6'>{this.props.config.name} - {i18next.t('temperature:temperature')} ({currentTemp})</span>
        <ResponsiveContainer height={this.props.height}>
          <LineChart data={metrics}>
            <Line dataKey='value' stroke='#33b5e5' isAnimationActive={false} dot={false} />
            <XAxis dataKey='time' />
            <Tooltip />
            <YAxis type="number" domain={[75,85]} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    config: state.tcs.find((el) => { return el.id === ownProps.sensor_id }),
    usage: state.tc_usage[ownProps.sensor_id]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch: (id) => dispatch(fetchTCUsage(id))
  }
}

const MultiReadingsChart = connect(mapStateToProps, mapDispatchToProps)(chart)
export default MultiReadingsChart