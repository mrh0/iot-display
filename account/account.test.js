const {login, create, check, addDisplay, getUserDisplays, addDisplaySession, addUserSession, sessionsCleaner} = require("./account");

test('Add a user session.', () => {
    const id = "testid";
    const session = addUserSession(id)
    check(session, (data) => {
        expect(data).not.toBe(null);
        expect(data.id).toBe(id);
    }, (e) => {
        expect(e).toBe('To never get here.')
    })
});

test('Clean session remove.', () => {
    const id = "testid";
    const session = addUserSession(id)
    sessionsCleaner(new Date().addHours(5));
    check(session, (data) => {
        expect(data).toBe('To never get here.')
    }, (e) => {
        expect(e).toBe("Session has expired.");
    })
});

test('Clean session keep.', () => {
    const id = "testid";
    const session = addUserSession(id)
    sessionsCleaner(new Date().addHours(0.5));
    check(session, (data) => {
        expect(data).not.toBe(null);
        expect(data.id).toBe(id);
    }, (e) => {
        expect(e).toBe('To never get here.')
    })
});