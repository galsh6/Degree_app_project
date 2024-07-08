import 'react-native-gesture-handler';
import {TextInput, View, Text, Button, TouchableWithoutFeedback, Pressable, ScrollView, Keyboard } from "react-native";
import { useEffect, useState } from 'react';
import { styles} from '../../StyleSheet';
import { useIsFocused } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { getDatabase, ref, child, get, remove, update} from 'firebase/database';
import auth from '@react-native-firebase/auth';
import { Colors } from 'react-native/Libraries/NewAppScreen';



function Storage({ navigation }){
  //the {navigation} will be used to move between screens 
  //* the component tha will save the database 
    const [data, dataset] = useState(1)
  //* the component that will show the edit overlay
    const [showedit, setedit] = useState("none")
  //* the component that will save the new amount 
    const [editamount, setamount] = useState("")
    //* the component that will save the new weight
    const [editweight, setweight] = useState("")
    //* the component that will save the catagry of an item
    const [edittype, settype] = useState("")
    //* the component that will save the name of an item
    const [edititem, setitem] = useState("")
    const [isr,rloead] =useState(false)
    //* to get the curent user uid
    const user = auth().currentUser
    const uid = user.uid 
    const isFocused = useIsFocused();
    //* get data forom firebase
    const db = getDatabase()
    const dbRef = ref(getDatabase());
    useEffect(()=>{
       //* Fetch data from the database using the Firebase get method
  get(child(dbRef, `Data/Users/${uid}/`)).then((snapshot) => {
    //** Check if the snapshot exists
    if (snapshot.exists()) {
      //** Extract data from the snapshot
      const d = snapshot.val()
      //** Update the component with the fetched data
      dataset(d)
    }
  }).catch((error) => console.error(error)) //** Log any errors that occur during fetching
  rloead(false)
    },[,isr,isFocused])

//** Define the renderItems function that fetches and displays items from the database
function renderItems() {
 

  //** Check if data.Items is truthy, meaning data has been loaded successfully
  if (data.Items) {
    //** Extract the keys (types of items) from data.Items
    const Typeskeys = Object.keys(data.Items);
    //** Initialize an array to hold the JSX for each type
    let types = [];
    //* Iterate over each type of item
    Typeskeys.forEach((type) => {
      //* Extract the keys (individual items) of the current type
      const Itemskeys = Object.keys(data.Items[type]);
      //* Initialize an array to hold rows of items
      let rows = [];
      //* Initialize an array to hold a single row of items
      let row = [];
      //* Iterate over each item
      Itemskeys.forEach((item, index) => {
        //* Add a View component for each item containing its details
        row.push(
          <View
            key={item}
            style={styles.storagecard}
          >
            {/*//* Container for the item's name */}
            <View
              style={styles.storagerow}
            >
              <Text style={styles.storageitem}>{item}</Text>
            </View>
            {/*//* Container for the item's details (amount and weight) */}
            <View
              style={styles.storageinfo}
            >
              {/*//* Row for the amount */}
              <View style={styles.storageinforow}>
                <Text style={styles.storagetext}>
                  {"amount : " + data.Items[type][item].amount}
                </Text>
              </View>
              {/*//* Row for the weight */}
              <View style={styles.storageinforow}>
                <Text style={styles.storagetext}>
                  {"weight : " + data.Items[type][item].weight}
                </Text>
              </View>
              {/*//* Container for the edit and delete buttons */}
              <View style={styles.storageinfobut}>
                <Button title='Edit' 
                onPress={()=>{
                  setedit("")
                  setitem(item)
                  settype(type)}}
                />
                <Button title='Delete' 
                //* delete the curent item 
                onPress={()=>{deleteitem(type,item)}}/>
              </View>
            </View>
          </View>
        );

        //* If index is odd or it's the last element, push the current row to the rows array and start a new one
        if (index % 2 !== 0 || index === Itemskeys.length - 1) {
          rows.push(
            <View
              key={"row_" + index}
              style={styles.storagebr}
            >
              {row}
            </View>
          );
          row = [];
        }
      });

      //* Add a container for the current type with its items
      types.push(
        <View key={type}>
          <View style={styles.storagentype}>
            {/*//* Container for the type's name */}
            <View
              style={styles.storagetypecard}>
              <Text style={styles.storagetypetext}>{type}</Text>
            </View>
            {/*//* Render the rows of items for the current type */}
            {rows}
          </View>
        </View>
      );
    });
    //* Return the types array containing all items organized by type
    return <View style={styles.storagecon}>
       {/* <Button
       style={{width:40}}
    title='⟳'
    onPress={()=>{rloead(true)}
    }
    /> */}
      {types}</View>;
  }

  //* Return null if data.Items is falsy, indicating no data to display
  return null;
}
async function deleteitem(type,item){
   await remove(ref(db,`Data/Users/${uid}/Items/${type}/${item}/`))
   rloead(true)
}
async function editstorage(){
  await update(ref(db,`Data/Users/${uid}/Items/${edittype}/${edititem}/`),{
    amount : editamount,
    weight : editweight
  })
  rloead(true)
}
  
    return(
 
    <View style={[styles.container]}>
    {/* navigation bar */}
    {/* View for the navigation bar */}
<View style={styles.navigationbar}>
  {/* Pressable component to toggle the drawer navigation */}
  <Pressable 
    onPress={()=>{navigation.toggleDrawer();}}> 
    {/* Text for the hamburger icon */}
    <Text style={styles.navbaricon}>☰</Text>
  </Pressable>
  {/* Pressable component for the 'Storage' screen */}
  <Pressable 
    onPress={()=>{return null}}>
    {/* Text for the 'Storage' link */}
    <Text style={styles.navbarcur}>Storage</Text>
  </Pressable>
  {/* Pressable component to navigate to the 'Additem' screen */}
  <Pressable 
    onPress={async ()=>{
      
      navigation.navigate('Additem')}}>
    {/* Text for the 'Add Item' link */}
    <Text style={styles.navbartext}>Add Item</Text>
  </Pressable>
</View>

        {//! start of screen 
        }
        {/*//* make the width of the content 100% */}
    <View style={{ width: '100%'}}>
      {/* //* make the content scrollabel */}
    <ScrollView>
   
      {/*//* render the content */}
        {renderItems()}
    </ScrollView>
</View>


<TouchableWithoutFeedback onPress={() => {setedit("none"); Keyboard.dismiss}}>
  {/*//* Overlay for edit */}
  <View style={[styles.overlay,{display: showedit}]}>
    <TouchableWithoutFeedback>
      {/*//* Edit card */}
      <View style={styles.card}>
        {/*//* Row for amount input */}
        <View style={styles.cardrowt}>
          <Text style={styles.textlogin}>amount: </Text>
          {/*//* Input field for amount */}
          <TextInput style={styles.logintextinput}
            onChangeText={textamount =>{setamount(textamount)}}
            keyboardType='number-pad'
            textAlign="center"
          />
        </View>
        {/*//* Row for weight input */}
        <View style={styles.cardrowt}>
          <Text style={styles.textlogin}>weight: </Text>
          {/*//* Input field for weight */}
          <TextInput style={styles.logintextinput}
            onChangeText={textweight =>{setweight(textweight)}}
            keyboardType='number-pad'
            textAlign="center"
          />
        </View>
        {/*//* Row for buttons */}
        <View style={styles.cardrowb}>
          {/*//* Submit button */}
          <Button
            title='submit'
            onPress={() => {
              Keyboard.dismiss(); //* Dismiss the keyboard
              editstorage(); //* Call editstorage function
              setedit("none"); //* Hide the edit overlay
            }}
          />
          {/*//* Close button */}
          <Button
            title='close'
            onPress={() => {setedit("none"); Keyboard.dismiss}}
             //* Hide the edit overlay and dismiss the keyboard
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  </View>
</TouchableWithoutFeedback>


    </View>
    // Edit overly
    
    )
}


export{Storage}