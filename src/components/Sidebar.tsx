import React, { useEffect, useState } from 'react'
import { slide as Menu } from 'react-burger-menu';
import { useWindowDimensions } from '../utils/windowDimensions';

var styles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '36px',
    height: '30px',
    right: '30px',
    top: '29px'
  },
  bmBurgerBars: {
    background: '#1c1e33',
    height: '10%',
  },
  bmBurgerBarsHover: {
    background: '#1c1e33'
  },
  bmCrossButton: {
    height: '25px',
    width: '25px',
  },
  bmCross: {
    background: '#1c1e33'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
    width: '400px',
    maxWidth: '60%'
  },
  bmMenu: {
    background: 'rgba(254, 254, 254, 255)',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em',
    overflowY: 'hidden',
  },
  bmMorphShape: {
    fill: '#ffffff'
  },
  bmItemList: {
    color: '#1c1e33',
    padding: '0.5em'
  },
  bmItem: {
    cursor: 'pointer',
    padding: '0.8em',
    textDecoration: 'none',
  },
  bmOverlay: {
    background: 'rgba(255, 255, 255, 0.2)',
    width: '100%'
  }
}

type SidebarProps = {
  target: string;
  setTarget: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({ target, setTarget }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bmStyles, setBmStyles] = useState(styles);
  const { width } = useWindowDimensions();
  const largeWidth = 1400;
  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  }
  const closeSideBar = () => {
    if (width<=largeWidth) {
      setIsOpen(false);
    }
  }
  const selectMenu = (target: string) => {
    setTarget(target);
    if (width<=largeWidth)setIsOpen(false);
    window.history.replaceState(null,'',target==='montyhall' ? '/' : `/${target}`);
  }
  useEffect(() => {
    if (width>largeWidth) {
      setIsOpen(true);
      let bmStyles_ = Object.assign({}, bmStyles);
      bmStyles_['bmOverlay'] = {
        background: 'rgba(255, 255, 255, 0.2)',
        width: '0px'
      }
      setBmStyles(bmStyles_);
    } else {
      setIsOpen(false);
      setBmStyles(styles);
    }
  }, [width])
  return (
    <Menu styles={ bmStyles } right isOpen={isOpen} onOpen={handleIsOpen} onClose={closeSideBar}>
      <a className="menu-item"
        onClick={()=>{selectMenu('montyhall')}}
        onKeyDown={(e)=>{if (e.key === 'Enter') selectMenu('montyhall')}}
        style={target==='montyhall' ? {textDecoration: 'underline'} : {textDecoration: ''}}
      >
        モンティホール
      </a>
      <a className="menu-item"
        onClick={()=>{selectMenu('lottery')}}
        onKeyDown={(e)=>{if (e.key === 'Enter') selectMenu('lottery')}}
        style={target==='lottery' ? {textDecoration: 'underline'} : {textDecoration: ''}}
      >
        くじ引き
      </a>
      <a className="menu-item"
        onClick={()=>{selectMenu('montecarlo')}}
        onKeyDown={(e)=>{if (e.key === 'Enter') selectMenu('montecarlo')}}
        style={target==='montecarlo' ? {textDecoration: 'underline'} : {textDecoration: ''}}
      >
        モンテカルロ法円周率
      </a>
    </Menu>
  )
}

export default Sidebar
