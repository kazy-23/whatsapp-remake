import React, { useEffect, useState } from 'react'
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase';
import { getDoc, doc, setDoc, query, collection, where, getDocs, addDoc, onSnapshot, orderBy, serverTimestamp} from 'firebase/firestore';

function Main() {
    const [user] = useAuthState(auth);
    const [chat, setChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(null);
    const [searchResult, setSearchResult] = useState(null);
    const [search, setSearch] = useState('');
    
    useEffect(() => {
        async function load() {
            const snap = await getDoc(doc(db, 'users', user.uid));
            if(snap.exists()){
                const s = await getDocs(query(collection(db, 'users', user.uid, 'chats')));
                let list = [];
                s.forEach((doc)=>{
                    list.push(doc.data())
                })
                setChats(list);
            }
            else{
                await setDoc(doc(db, 'users', user.uid), {
                    id: user.uid,
                    photo: user.photoURL,
                    name: user.displayName,
                })
            }
        }
        load();
    }, [user.uid, user.photoURL, user.displayName])

    useEffect(()=>{
        async function doSearch () {
            const q = query(collection(db, 'users'), where('name', '==', search));
            const snap = await getDocs(q);
            let result;
            snap.forEach((doc)=>{
                result = doc.data();
            })
            if(result != null){
                setSearchResult(result);
            }
            else{
                setSearchResult(null);
            }
        }
        if(search !== '')doSearch();
        else setSearchResult(null);
    }, [search])

    useEffect(()=>{
        if(chat === null)return;
        const unsub = onSnapshot(query(collection(db, 'chats', chat.chat, 'messages'), orderBy('date', 'asc')), (snap)=>{
            let list = [];
            snap.forEach((doc)=>{
                list.push(doc.data())
            })
            setMessages(list);

            return ()=>unsub();
        })
    }, [chat])

    const newChat = async()=>{
        // check if already exists

            await setDoc(doc(db, 'chats', user.uid+searchResult.id), {
                users: [user.uid, searchResult.id],
            })

            await addDoc(collection(db, 'users', user.uid, 'chats'), {
                chat: user.uid+searchResult.id,
                id: searchResult.id,
                name: searchResult.name,
                photo: searchResult.photo,
            })

            if(user.uid !== searchResult.id){
                await addDoc(collection(db, 'users', searchResult.id, 'chats'), {
                    chat: user.uid+searchResult.id,
                    id: user.uid,
                    name: user.displayName,
                    photo: user.photoURL,
                })
            }

            let list = chats
            list.push({
                id: searchResult.id,
                photo: searchResult.photo,
                name: searchResult.name,
                chat: user.uid+searchResult.id,
            })
            setChats(list);

        setSearch('');
    }

    const openChat = async(one)=>{
        setChat({
            id: one.id,
            name: one.name,
            photo: one.photo,
            chat: one.chat
        });
    }

    const send = async()=>{
        await addDoc(collection(db, 'chats', chat.chat, 'messages'), {
            author: user.uid,
            msg: message,
            date: serverTimestamp(),
        })
        setMessage('');
    }
    
    return (
        <div className='layout'>
            <div className='list'>
                <span><input type='text' placeholder='Display name...' value={search} onChange={(e)=>setSearch(e.target.value)}/></span>
                <div className='overflow'>
                    {searchResult !== null && <><div onClick={newChat}><img src={searchResult.photo} alt='profile'/>{searchResult.name}</div><hr /></>}
                    {chats.map((one)=>(
                        <div key={one.id} onClick={()=>openChat(one)}><img src={one.photo} alt='profile'/>{one.name}</div>
                    ))}
                </div>
            </div>
            <div className='chat'>
                {chat !== null ?
                    <>
                        <div className='header'><img src={chat.photo} alt='profile'/>{chat.name}</div>
                            <div className='main'>
                                {messages?.map((message)=>(
                                    <div style={message.author === user.uid ? {'textAlign': 'end'} : {'textAlign': 'start'}}>
                                        <span className={message.author === user.uid ? 'mine' : 'fdahgfijdhasfhkdsahf'}>{message.msg}</span>
                                    </div>
                                ))}
                            </div>
                        <div className='send'><input type='text' placeholder='Type...' onChange={(e)=>setMessage(e.target.value)} value={message}/><div onClick={send}>Send</div></div>
                    </>
                :
                    <div className='centered'>
                        <div>
                            <p>Click on a chat to see the conversation.</p>
                            <p>If don't have any chats, search for a partner in the search box.</p>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Main