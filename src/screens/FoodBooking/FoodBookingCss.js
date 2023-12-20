import { makeStyles } from "@mui/styles"
//export { useStyles } from "@mui/styles"

 export const useStyles = makeStyles({
    root:{width :"auto", height:"auto", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b", padding:10, flexDirection:'column'},
    box: {width:"90%", height:"auto", background:"#fff", borderRadius:10, padding:15, display:'flex', marginBottom:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
})