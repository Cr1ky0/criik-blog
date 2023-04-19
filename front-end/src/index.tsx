import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// antd
import { ConfigProvider } from 'antd';

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

// app
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
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
            <ViewportProvider>
              <AvatarProvider>
                <IconStore>
                  <App />
                </IconStore>
              </AvatarProvider>
            </ViewportProvider>
          </PersistGate>
        </Provider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
