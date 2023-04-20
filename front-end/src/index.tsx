import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// antd
import { ConfigProvider, message } from 'antd';

// redux
import { store, persistor } from './redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// global
import { THEME_COLOR } from './global';

// provider
import ViewportProvider from './components/ContextProvider/ViewportProvider';
import IconStore from '@/components/ContextProvider/IconStore';
import AvatarProvider from '@/components/ContextProvider/AvatarPrivider';
import MessageProvider from '@/components/ContextProvider/MessageProvider';

// app
import App from './App';

message.config({
  top: 50,
  duration: 1,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLOR,
        },
      }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MessageProvider>
            <ViewportProvider>
              <AvatarProvider>
                <IconStore>
                  <App />
                </IconStore>
              </AvatarProvider>
            </ViewportProvider>
          </MessageProvider>
        </PersistGate>
      </Provider>
    </ConfigProvider>
  </BrowserRouter>
);