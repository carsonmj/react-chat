import React from 'react';
import FaceIcon from '@material-ui/icons/Face';

const ChatCard = React.memo(({chat, users, index, uid, onEmojiClick}) => {
  const who = () => {
    const user = users[chat.uid]
    if (user){
      return user.nickName
    }else{
      return "anonymous"
    }
  } 

  // const renderEmojiSection = () => {
  //   const emojiObj = chat.emoji
  //   return <>
  //     <div className="fdr">
  //       <EmojiButton emojiKey={'1'} emojiValue={"😎"} emojiObj={emojiObj}/>
  //       <EmojiButton emojiKey={'2'} emojiValue={"🤣"} emojiObj={emojiObj}/>
  //     </div>  
  //   </>
  // }

  // const EmojiButton = ({emojiKey, emojiValue, emojiObj}) => {
  //   let extraClassName = ""
  //   if(emojiObj && emojiObj[emojiKey]){
  //     if(emojiObj[emojiKey].includes(uid)){
  //       extraClassName = "active"
  //     }
  //   }

  //   return <div>
  //     <div onClick={e=> onEmojiClick(emojiKey, chat.id)} className={`emojiRec flex fdr aic ${extraClassName}`}>
  //       <span>{emojiValue}</span>
  //       <span>
  //         {emojiObj && emojiObj[emojiKey] &&
  //           <div>{emojiObj[emojiKey].length}</div>
  //         }
  //       </span>
  //     </div>
  //   </div>
  // }

  return <div className="flex fdr pb16 chat_card" key={index}>
    <div className="w40 h40 flex aic jcc">
      <FaceIcon color='primary' fontSize='large'/>
    </div>
    <div className="pl16 f1" style={{backgroundColor:'#dee5f4', borderRadius:20, marginLeft:10}}>
      <div>
        <span className="bold" >{who()}</span>
      </div>
      <div className="pt8">
        {chat.content}
      </div>
    </div>    
  </div>
}, (prevProps, nextProps) => {
  return (prevProps.chat === nextProps.chat) && (prevProps.users === nextProps.users)
});

export default ChatCard