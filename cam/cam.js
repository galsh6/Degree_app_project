import { firebase , getDatabase, ref, onValue, child, get,update} from 'firebase/database';
import { TextInput, View, Text, Button, TouchableWithoutFeedback, Animated, Image,Pressable} from "react-native";
import auth, { signOut, } from '@react-native-firebase/auth';
import { styles} from '../../StyleSheet';
import { useState, useEffect, useRef, } from 'react';
import axios from 'axios';


function Cam({ navigation }){
    const [isimg, renderimg] = useState(1)
    const [img, setimg] = useState("")
    const [userdata, userset] = useState(1)
    const [camdata, camset] = useState(1)
    const [findid, idset] = useState(1)
    const [url, urlset] = useState(1)
    const [isr,rloead] =useState(false)
            const db = getDatabase()
            const dbRef = ref(getDatabase());
            const user = auth().currentUser
            const uid = user.uid 
       useEffect(() => {
         get(child(dbRef, `Data/`)).then( (snapshot) => {
        if (snapshot.exists()) {
        const d = snapshot.val()
         userset(d.Users[uid])
         camset(d.cam)
         rloead(false)
        }})}, [,isr])
            

        
    function render(){
        if(userdata.cam != null){
        if(userdata.cam.id == 'none'){
            return(
                <View style={styles.card}>
                <View style={styles.cardrowt}>
                    <Text style={styles.textlogin}>camera id</Text>
                    <TextInput
                    style={styles.logintextinput}
                    onChangeText={text =>{idset(text)}}/>
                </View>
                <View style={styles.cardrowb}> 
                <Button 
                title='submit'
                onPress={()=>{setcam()}}/>
                </View>
                </View>
            )
        }
        else
        {
        return(
                <View style={styles.card}>
                    <View style={styles.cardrowt}>
                      <Text style={styles.navbartext}>you have a camera set to your acount</Text>
                    </View>
                    <View style={styles.cardrowb}>
                    <Button
                        title='use camera'
                        onPress={()=>(navigation.navigate('Additem')
                        )}/>
                      <Button
                      title='forget camera'
                      onPress={()=>(removecam())}
                      />
                    </View>
                </View>
            )
        }}    }
    async function removecam(){
      await  update(ref(db,'Data/Users/ZflqbrhfhyeuF0yokBScPCCau513/cam/'),
            {
               'id' :  'none',
               'url' : ''
            })
            rloead(true)
    }
    async function setcam(){
        const ids = Object.keys(camdata)
        const newcam = ids.find((i) =>{
            console.log(i)
            console.log(findid)
           return i === findid})
        if(camdata[newcam] != null){
          await  update(ref(db,'Data/Users/ZflqbrhfhyeuF0yokBScPCCau513/cam/'),
            {
               'id' :  newcam,
            })
            urlset(camdata[newcam].url)
        }
        rloead(true)
    }
    return(
        <View style={styles.container}>
            {//! navigation bar 
      }
      <View style={styles.navigationbar}>
          <Pressable 
           onPress={()=>{navigation.toggleDrawer();}}> 
           <Text style={styles.navbaricon}>☰</Text>
          </Pressable>
          <Pressable 
           onPress={()=>{navigation.navigate('Storage')}}>
           <Text style={styles.navbartext}>Storage</Text>
          </Pressable>
          <Pressable 
           onPress={()=>{navigation.navigate('Additem')}}>
           <Text style={styles.navbartext}>Add Item</Text>
          </Pressable>
          <Pressable  
           onPress={()=>{return null}}>
           <Text style={styles.navbarcur}>cam</Text>
          </Pressable>
          {//! start of screen 
          }
          
      </View>  
            <Text>{render()}</Text>
            
        </View>
    )
}
export{Cam}