import ReactDOM from 'react-dom/client'
import App from './App'
import { LoadingProvider } from './common/Hook/useLoading'

import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  //<React.StrictMode>
  <LoadingProvider>
    <App />
  </LoadingProvider>
  //</React.StrictMode>,
)
