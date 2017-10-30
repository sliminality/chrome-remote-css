// @flow @format
import io from 'socket.io-client';
import messageTypes from './messageTypes';

const socket = io(`http://localhost:${1111}/browsers`, {
  reconnectionAttempts: 5,
});
