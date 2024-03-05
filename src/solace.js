import solace from 'solclientjs';

const factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

export default function() {
  let session;
  let messageCallbacks = new Map();

  function connect(opts, callback) {
    session = solace.SolclientFactory.createSession(opts);
    session.once(solace.SessionEventCode.UP_NOTICE, () => callback());
    session.once(solace.SessionEventCode.CONNECT_FAILED_ERROR, (e) => 
      callback(new Error(e.infoStr)));

    session.on(solace.SessionEventCode.ACKNOWLEDGED_MESSAGE, e => onMessageAck(e, true));
    session.on(solace.SessionEventCode.REJECTED_MESSAGE_ERROR, e => onMessageAck(e, false));
    session.connect();
  }

  function send(topic, payload, callback) {
    const correlationKey = Symbol();
    const destination = solace.SolclientFactory.createTopicDestination(topic);

    const message = solace.SolclientFactory.createMessage();
    message.setDestination(destination);
    message.setBinaryAttachment(payload);
    message.setDeliveryMode(solace.MessageDeliveryModeType.PERSISTENT);
    message.setCorrelationKey(correlationKey);

    messageCallbacks.set(correlationKey, callback);
    session.send(message);
  }

  function onMessageAck(e, result) {
    const callback = messageCallbacks.get(e.correlationKey);
    if (callback) {
      messageCallbacks.delete(e.correlationKey);
      callback(result ? undefined : new Error(e.infoStr));
    }
  }

  return {
    connect,
    send
  };
}