import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { WingBlank, WhiteSpace, Carousel, NavBar, Icon, Button, Tag, Toast } from 'antd-mobile'
import axios from 'axios'
import jay from '../assets/jay.jpg'
import jay1 from '../assets/jay1.jpg'
import jay2 from '../assets/jay2.jpg'
import TagContainer from '../components/TagContainer'


export class Rush extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgData: [
        {key: '1', url: jay}, 
        {key: '2', url: jay1},
        {key: '3', url: jay2}
      ],
      imgHeight: 300,
      day: '',
      place: '',
      num: '',
      leftHour: 0,
      leftMinute: 0,
      leftSecond: 0,
      disabled: true,
      dayData: [],
      placeData: [],
      numData: [],
      rushData: {},
      finished: false,
      started: false,
    }
  }

  componentDidMount() {
    this.getRushInfo().then((result) => {
      console.log(result);
      let dayDataBlob = result.days.map((obj, i) => ({
        key: i,
        value: obj.string,
      }));
      this.setState({
        dayData: dayDataBlob,
        rushData: result,
        finished: true
      });
    })
    this.timeCount(); 
  }

  getRushInfo = async () => {
    let rushInfo = null;
    await axios.get('http://localhost:8080/rush/get').then((response) => {
      if(response.data.code === '0') {
        rushInfo = response.data.result;
      }
    })
    return rushInfo;
  }

  passDayValue = (key) => {
    let placeDataBlob = this.state.rushData.days[key].places.map((obj, i) => {
      return ({
        key: i,
        value: obj.string,
        disabled: !(obj.remain > 0)
      })
    })
    this.setState({
      day: key,
      placeData: placeDataBlob,
    })
  }

  passPlaceValue = (key) => {
    let numDataBlob = [];
    for(let i = 0; i < this.state.rushData.limit; i++) {
      numDataBlob.push({key: i, value: (i+1).toString() + "张"})
    }
    // console.log(numDataBlob);
    this.setState({
      place: key,
      numData: numDataBlob,
    })
  }

  passNumValue = (key) => {
    this.setState({
      num: key,
    })
  }

  timeCount = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = 11;
    let minute = 30;
    let second = 0;
    let nowTime = Date.now();
    let time = Number(new Date(year,month,day,hour,minute,second));
    let timeDiff = Math.round((time - nowTime)/1000);
    let leftHour = parseInt(timeDiff/3600%24);
    let leftMinute = parseInt(timeDiff/60%60);
    let leftSecond = timeDiff%60;
    if(leftHour <=0 && leftMinute <=0 && leftSecond <=0) {
      this.setState({
        disabled: false,
        started: true
      })
    } else {
      this.setState({
        leftHour: leftHour,
        leftMinute: leftMinute,
        leftSecond: leftSecond
      })
      setTimeout(this.timeCount, 1000);
    } 
  }

  onClick = () => {
    console.log(this.state.day);
    console.log(this.state.place);
    console.log(this.state.num);
    if(this.state.day === '') {
      Toast.info("请选择日期", 3);
      return;
    }
    if(this.state.place === '') {
      Toast.info("请选择座位", 3);
      return;
    }
    if(this.state.num === '') {
      Toast.info("请选择数量", 3);
      return;
    }
    this.setState({
      disabled: true
    });
    Toast.loading("抢票中，请稍候~", 0);
    let formData = new URLSearchParams();
    formData.append('day', this.state.day);
    formData.append('place', this.state.place);
    formData.append('num', this.state.num + 1);
    axios.post('http://localhost:8080/rush/go', formData)
      .then((response) => {
        console.log(response.data);
        if(response.data.code === '5') {
          Toast.fail("您已经抢购过,去订单里看看吧~", 3);
        }
        if(response.data.code === '0') {
          Toast.success("抢购成功,去订单里看看吧~", 3);
        }
        if(response.data.code === '1') {
          Toast.fail("手速慢啦，已经抢购一空~", 3);
        }
      });
  }


  render() { 
    let timeString = "距开售："+ this.state.leftHour + "时" + this.state.leftMinute + "分" + this.state.leftSecond + "秒"; 
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
          {this.state.imgData.map(obj => (
            <a
              key={obj.key}
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
              href=""
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
          <Tag small style={{marginTop: '12px', color: '#E00000'}}>限购{this.state.rushData.limit}张</Tag>
        </div>
        <WhiteSpace size="lg"/>
        <WingBlank size="lg">
          <p style={{color: "#404040", fontSize: '12px', textIndent: '2em', lineHeight: '16px', margin: '0px'}}>周杰伦将在上海举办个人演唱会.本次演唱会分为两场，周六晚与周日晚各一场，座位为为内场、外场与山顶，请大家选购合适自己的场次与座位。此外，本次购票每人限购两张且场次座位需相同。抢购将于XX:XX开始，请大家做好准备！</p>
          <WhiteSpace/>
          { this.state.finished ? 
            (<TagContainer title="请选择场次" data={this.state.dayData} passValue={this.passDayValue.bind(this)}></TagContainer>) : null
          }
          { this.state.day === '' ? null :
            (<div>
              <WhiteSpace />
              <TagContainer title="请选择位置" data={this.state.placeData} passValue={this.passPlaceValue.bind(this)}></TagContainer>
            </div>)
          }
          { this.state.place === '' ? null :
            (<div>
              <WhiteSpace />
              <div style={{display: 'flex', paddingTop: '9px', flexDirection: 'row', flexWrap: 'wrap'}}>
                <span style={{lineHeight: '25px', color: '#303030', width: '100px', textAlign: 'right'}}>单价：</span>
                <span style={{lineHeight: '25px', marginLeft: '25px', width: '60px', color: '#E00000'}}>{this.state.rushData.days[this.state.day].places[this.state.place].price}元</span>
              </div>
            </div>)
          }
          { this.state.place === '' ? null :
            (<div>
              <WhiteSpace />
              <TagContainer title="请选择数量" data={this.state.numData} passValue={this.passNumValue.bind(this)}></TagContainer>
            </div>)
          }
          { this.state.num === '' ? null :
            (<div>
              <WhiteSpace />
              <div style={{display: 'flex', paddingTop: '9px', flexDirection: 'row', flexWrap: 'wrap'}}>
                <span style={{lineHeight: '25px', color: '#303030', width: '100px', textAlign: 'right'}}>总计：</span>
                <span style={{lineHeight: '25px', marginLeft: '25px', width: '60px', color: '#E00000'}}>{this.state.rushData.days[this.state.day].places[this.state.place].price * (this.state.num+1)}元</span>
              </div>
            </div>)
          }
        </WingBlank>
        <WhiteSpace />
        <Button
          type = "primary"
          style={{backgroundColor: '#FF6633', position: 'fixed', bottom: '0px', width: '414px'}}
          onClick={this.onClick}
          disabled={this.state.disabled}
        >{this.state.started ? "立即抢购" : timeString}</Button>
      </div>

    )
  }
}

export default Rush
