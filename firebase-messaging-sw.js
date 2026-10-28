// Importar los scripts oficiales de Firebase para Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Configuración de tu proyecto en Firebase
firebase.initializeApp({
  apiKey: "AIzaSyA-x62LGZKHJcSY3ry0ZimP6vIAwSniU-4",
  authDomain: "padel-pro-4c4d7.firebaseapp.com",
  databaseURL: "https://padel-pro-4c4d7-default-rtdb.firebaseio.com",
  projectId: "padel-pro-4c4d7",
  storageBucket: "padel-pro-4c4d7.firebasestorage.app",
  messagingSenderId: "764384530544",
  appId: "1:764384530544:web:c146696d3bbda2534ee4b5"
});

const messaging = firebase.messaging();

// Recibir la notificación push cuando la app está cerrada o en segundo plano
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Notificación recibida en segundo plano:', payload);

  const tituloNotificacion = payload.notification?.title || payload.data?.title || '11Padel Point Pro';
  const opcionesNotificacion = {
    body: payload.notification?.body || payload.data?.body || 'Tienes una nueva actualización en tu torneo.',
    icon: 'img/app_icon.png',
    badge: 'img/app_icon.png',
    vibrate: [200, 100, 200, 100, 300], // Patrón de vibración en el móvil
    data: {
      url: payload.data?.url || '/'
    }
  };

  return self.registration.showNotification(tituloNotificacion, opcionesNotificacion);
});

// Al pulsar la notificación en la barra del teléfono, abrir la app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlDestino = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlDestino) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlDestino);
      }
    })
  );
});