import logo from "../../assets/logo.png"
import list from "../../assets/list.png"
import { useNavigate } from "react-router-dom"

export default function Heading({title, myroute}){
    var navigate = useNavigate()
    return(
        <div style={{display:"flex", alignItems:"center", fontFamily:'Kanit', fontWeight:"bold", fontSize:20, letterSpacing:1,}}>
           <div> <img src={logo} width="40"></img></div>
            <div style={{paddingLeft:5}}> {title}</div>
            <img src={list} width="35"  style={{marginLeft:'auto'}} onClick={()=>navigate(`${myroute}`)}></img>
        </div>
    )
}