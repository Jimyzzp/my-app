import React, {
	Component
} from 'react';
import { CSSTransition } from 'react-transition-group';
import { actionCreators } from './store';
import {
	HeaderWrapper,
	Logo,
	Nav,
	NavItem,
	NavSearch,
	Addtion,
	Button,
	SearchWrapper,
	SearchInfo,
	SearchSwitch,
	SearchItem
} from './style';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
class Header extends Component {
	getListArea() {
		const {
			focused,
			list,
			page,
			totalPage,
			mouseIn,
			handleMouseLeave,
			handleMouseEnter,
			handleChangePage
		} = this.props;
		const pageList=[];
        if(list.length>0){
        		for(let i=(page-1)*5;i<page*5;i++){
			pageList.push(
				<SearchItem key={list[i].name}>{list[i].name}</SearchItem>
			)
			
		}
        }
		if(focused || mouseIn) {
			return(
				<SearchInfo onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
						<h6>热门搜索<SearchSwitch onClick={() => handleChangePage(page,totalPage,this.spinIcon)}>
        		<i ref={(icon)=>{
        			this.spinIcon=icon
        		}}className="iconfont spin">&#xe851;</i>换一批</SearchSwitch></h6>
					{pageList}
						</SearchInfo>)
		} else {
			return null
		}
	}
	
	render() {
		const {
			focused,
			handleInputFocus,
			handleInputBlur,
			list,
			login
		} = this.props;
		return(
			<HeaderWrapper>
			<Link to='/'><Logo></Logo></Link>
			<Nav>
			<NavItem className="left active"><Link to='/'>首页</Link></NavItem>
				<NavItem className="left">下载</NavItem>
					{login?<NavItem className="right">退出</NavItem>:	<Link to='/login'><NavItem className="right">登录</NavItem>	</Link>}
					<NavItem className="right"><i className="iconfont ">&#xe636;</i></NavItem>
						<SearchWrapper>
						<CSSTransition
            				in={focused}	
						classNames="slide"
						timeout={200}
						>
						<NavSearch 
				       onFocus={()=>handleInputFocus(list)} 
				       onBlur={handleInputBlur}
						className={focused?'focused ':''} >
						</NavSearch>
						</CSSTransition>
					   <i className={focused?'focused iconfont zoom':'iconfont zoom'}>&#xe637;</i>
						{this.getListArea(focused)}
						</SearchWrapper>
						<Addtion>
						<Button className="sign-up">注册</Button>
						<Button className="write-btn"><i className="iconfont">&#xe615;</i>写文章</Button>
						</Addtion>
			</Nav>
			</HeaderWrapper>
		)
	}
	componentDidMount(){
		
	}

}
const mapStateToprops = (state) => {
	return {
		focused: state.get('header').get('focused'),
		mouseIn: state.get('header').get('mouseIn'),
		list: state.getIn(['header', 'list']),
		page:state.getIn(['header','page']),
		totalPage:state.getIn(['header','totalPage']),
		login:state.getIn(['login','login'])
	}
}
const mapDispathToprops = (dispatch) => {
	return {
		handleInputFocus(list) {
		(list.size===0)&&dispatch(actionCreators.getList());
			
			dispatch(actionCreators.searchFocus())
		},
		handleInputBlur() {
			dispatch(actionCreators.searchBlur())
		},
	
		handleMouseLeave(){
			dispatch(actionCreators.mouseLeave())
		},
		handleMouseEnter(){
			dispatch(actionCreators.mouseEnter())
		},
		handleChangePage(page,totalPage,spin){
					let originAngle = spin.style.transform.replace(/[^0-9]/ig, '');
			if (originAngle) {
				originAngle = parseInt(originAngle, 10);
			}else {
				originAngle = 0;
			}
			spin.style.transform = 'rotate(' + (originAngle + 360) + 'deg)';
	if (page < totalPage) {
				dispatch(actionCreators.changePage(page + 1));
			}else {
				dispatch(actionCreators.changePage(1));
			}
		}
	}
}
export default connect(mapStateToprops, mapDispathToprops)(Header);