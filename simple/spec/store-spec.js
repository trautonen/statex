import createStore from '../src/simple'

describe('store', () => {

  it("should dispatch change for mutation", (done) => {
    const store = createStore({
      initial: {
        root: 'hello'
      },
      mutations: {
        update: (state, value) => {
          state.root = value;
        }
      }
    });

    store.subscribe('root', root => {
      expect(root).toEqual('world');
      done();
    });

    store.commit('update', 'world');
  });

  it("should dispatch change for nested mutation", (done) => {
    const store = createStore({
      initial: {
        root: {
          child1: 'a',
          child2: 'b'
        }
      },
      mutations: {
        child1: (state, value) => {
          state.root.child1 = value;
        },
        child2: (state, value) => {
          state.root.child2 = value;
        }
      }
    });

    store.subscribe('root.child2', value => {
      expect(value).toEqual('d');
      done();
    });

    store.commit('child1', 'c');
    store.commit('child2', 'd');
  });

  it("should dispatch multiple changes in batch", (done) => {
    const store = createStore({
      initial: {
        root: {
          child1: 'a',
          child2: 'b'
        }
      },
      mutations: {
        child: (state, value) => {
          state.root.child1 = value;
        },
        root: (state, value) => {
          state.root = value;
        }
      }
    });

    store.subscribe('root', root => {
      expect(root).toEqual({ child1: 'a', child2: 'c' });
      done();
    });

    store.commit('child', 'e');
    store.commit('root', { child1: 'a', child2: 'c' })
  });

});
