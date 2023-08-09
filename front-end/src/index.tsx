import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// animate.css
import 'animate.css';

// redux
import { store, persistor } from './redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// provider
import ViewportProvider from './components/ContextProvider/ViewportProvider';
import IconStore from '@/components/ContextProvider/IconStore';
import AvatarProvider from '@/components/ContextProvider/AvatarPrivider';
import MessageProvider from '@/components/ContextProvider/MessageProvider';
import NoticeProvider from '@/components/ContextProvider/NoticeProvider';
import ModalProvider from '@/components/ContextProvider/ModalProvider';

// app
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MessageProvider>
          <ModalProvider>
            <NoticeProvider>
              <ViewportProvider>
                <AvatarProvider>
                  <IconStore>
                    <App />
                  </IconStore>
                </AvatarProvider>
              </ViewportProvider>
            </NoticeProvider>
          </ModalProvider>
        </MessageProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
