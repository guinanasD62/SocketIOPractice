
import { useState } from 'react'
import { Link } from 'react-router-dom';
import styles from './../css/Join.module.css'
const Join = () => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

    return (
        <div className={styles.join}>
            <form className={styles.form}>
                <input placeholder='name' onChange={(e) => setName(e.target.value)} />
                <input placeholder='room' onChange={(e) => setRoom(e.target.value)} />

                <Link to={`/chat?name=${name}&room=${room}`}>
                    <button type="button" className={styles.button} >
                        Join
                    </button>
                </Link>
            </form>

        </div>
    )
}

export default Join