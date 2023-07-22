import {useAuthState} from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Main from './pages/Main';
import Signup from './pages/Signup';

function App() {
  const [user] = useAuthState(auth);
  
  return (
    <>{user ? <Main /> : <Signup />}</>
  );
}

export default App;
