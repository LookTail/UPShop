import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { WingBlank, WhiteSpace, Carousel, NavBar, Icon, Button, Tag } from 'antd-mobile'
import jay from '../assets/jay.jpg'
import jay1 from '../assets/jay1.jpg'
import jay2 from '../assets/jay2.jpg'
import TagContainer from '../components/TagContainer'


export class Rush extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      data: [
        {key: '1', url: jay}, 
        {key: '2', url: jay1},
        {key: '3', url: jay2}
      ],
      imgHeight: 300,
      day: '',
      place: '',
      num: ''
    })
  }

  passDayValue = (val) => {
    // console.log(val);
    this.setState({
      day: val
    })
  }

  passPlaceValue = (val) => {
    this.setState({
      place: val
    })
  }

  passNumValue = (val) => {
    this.setState({
      num: val
    })
  }

  render() {
    let dayData = [{key: 0, value: "周六"}, {key: 1, value: "周日"}];
    let placeData = [{key: 0, value: "内场"}, {key: 1, value: "外场"}, {key: 2, value: "山顶"}];
    let numData = [{key: 0, value: "1张"}, {key: 1, value: "2张"}];
    return (
      <div>
        <NavBar 
          mode="light"
          icon={<Link to='/' style={{height: '22px'}}><Icon type='left'></Icon></Link>}
        >抢购页面</NavBar>
        <Carousel
          autoplay={true}
          infinite={true}
        >
          {this.state.data.map(obj => (
            <a
              key={obj.key}
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
              <img
                src={obj.url}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          ))}
        </Carousel>
        <WhiteSpace size="xl"/>  
        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
          <h1 style={{margin: '0px', fontSize: '24px'}}>周杰伦上海演唱会</h1>
          <Tag small style={{marginTop: '12px', color: '#E00000'}}>限购2张</Tag>
        </div>
        <WhiteSpace size="lg"/>
        <WingBlank size="lg">
          <p style={{color: "#404040", fontSize: '12px', textIndent: '2em', lineHeight: '16px', margin: '0px'}}>周杰伦将在上海举办个人演唱会.本次演唱会分为两场，周六晚与周日晚各一场，座位为为内场、外场与山顶，请大家选购合适自己的场次与座位。此外，本次购票每人限购两张且场次座位需相同。抢购将于XX:XX开始，请大家做好准备！</p>
          <WhiteSpace/>
          <TagContainer title="请选择场次" data={dayData} passValue={this.passDayValue.bind(this)}></TagContainer>
          <WhiteSpace />
          <TagContainer title="请选择位置" data={placeData} passValue={this.passPlaceValue.bind(this)}></TagContainer>
          <WhiteSpace />
          <TagContainer title="请选择数量" data={numData} passValue={this.passNumValue.bind(this)}></TagContainer>
        </WingBlank>
        <WhiteSpace />
        <div style={{height: '146px'}}></div>
        <Button
          type = "primary"
          style={{backgroundColor: '#FF6633'}}
          onClick={this.onClick}
        >立即下单</Button>
      </div>

    )
  }
}

export default Rush
