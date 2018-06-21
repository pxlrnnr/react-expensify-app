import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { startAddExpense, addExpense, editExpense, removeExpense, startSetExpenses } from '../../actions/expenses';
import expenses from '../fixtures/expenses';
import database from '../../firebase/firebase';

const createMockStore = configureMockStore([thunk]);

beforeEach((done) => {
    const expensesData = {};
    expenses.forEach(({ id, description, note, amount, createdAt }) => {
        expensesData[id] = { description, note, amount, createdAt }
    });
    database.ref('expenses').set(expensesData).then(() => done());
});

    test('should setup remove expense action object', () => {
        const action = removeExpense({ id: '123abc'});

        expect(action).toEqual({
            type: 'REMOVE_EXPENSE',
            id: '123abc'
        });
    });

    test('should setup edit expense action object', () => {
        const action = editExpense('111aaa',  { note: 'new note val' });

        expect(action).toEqual({
            type: "EDIT_EXPENSE",
            id: '111aaa',
            updates: {
                note: "new note val"
            }       
        });
    });

    test('should setup addExpense action object', () => {
        const action = addExpense(expenses[2]);

        expect(action).toEqual({
            type: 'ADD_EXPENSE',
            expense: expenses[2]
        });
    });
    //done will stop from resolving or rejecting untill done is called
    test('should add expense to data base and store', (done) => {
        const store = createMockStore({});
        const expenseData = {
            description: 'ass',
            amount: 69,
            note: 'big',
            createdAt: 6969
        };
        store.dispatch(startAddExpense(expenseData)).then(() => {
            const actions = store.getActions();
            expect(actions[0]).toEqual({
                type: 'ADD_EXPENSE',
                expense: {
                    id: expect.any(String),
                    ...expenseData
                }
            });

            return databse.ref(`expenses/${actions[0].expense.id}`).once('value');
        }).then((snapshot) => {
            expect(snapshot.val()).toEqual(expenseData);
            done();
        });
    });

    test('should add expense with defaults to data base and store', (done) => {
        const store = createMockStore({});
        const expenseDefaults = {
            description: '',
            note: '',
            amoutn: 0,
            createdAt: 0
        };
        store.dispatch(startAddExpense({})).then(() => {
            const actions = store.getActions();
            expect(actions[0]).toEqual({
                type: 'ADD_EXPENSE',
                expense: {
                    id: expect.any(String),
                    ...expenseDefaults
                }
            });

            return databse.ref(`expenses/${actions[0].expense.id}`).once('value');
        }).then((snapshot) => {
            expect(snapshot.val()).toEqual(expenseDefaults);
            done();
        });
    });

    test('should setup set expense action object with data', () => {
        const action = setExpenses(expenses);
        expect(action).toEqual({
            type: 'SET_EXPENSES',
            expenses
        });
    });

    test('should fetch expenses from firebase', (done) => {
        const store = createMockStore({});

        store.dispatch(startSetExpenses()).then(() => {
            const actions = store.getAtcions();
            expect(actions[0]).toEqual({
                type: 'SET_EXPENSES',
                expenses
            });
            done();
        });
    });