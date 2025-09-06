import React from 'react'

const banner = () => {
    const banner =`
  _________.__            __              .___             
 /   _____/|  |__ _____ _/  |______     __| _/______ __ __ 
 \_____  \ |  |  \\__  \\   __\__  \   / __ |\_  __ \  |  \
 /        \|   Y  \/ __ \|  |  / __ \_/ /_/ | |  | \/  |  /
/_______  /|___|  (____  /__| (____  /\____ | |__|  |____/ 
        \/      \/     \/          \/      \/              
    
        `     
  return (
    <div>
      
            <pre>{banner}</pre>

            
            <p>Welcome to my portfolio! Type 'help' to get started.</p>
    </div>
  )
}

export default banner
