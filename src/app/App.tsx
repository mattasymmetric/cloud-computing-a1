import EventBox from "./components/EventBox";

// "Your First React Typescript Project: a Todo List App", Typeofnan.dev, 2022. [Online]. Available: https://typeofnan.dev/your-first-react-typescript-project-todo-app/. [Accessed: 29- Apr- 2022].

let Events: EventInterface[] = [
    {
        title: "Test Event 1",
        description: "This is a short description for event 1.",
        image: "some_image",
    },
    {
        title: "Test Event 2",
        description: "This is a short description for event 2.",
        image: "some_image2",
    },
    {
        title: "Test Event 3",
        description: "This is a short description for event 3.",
        image: "some_image3",
    },
    {
        title: "Test Event 4",
        description: "This is a short description for event 4.",
        image: "some_image",
    },
    {
        title: "Test Event 5",
        description: "This is a short description for event 5.",
        image: "some_image2",
    },
    {
        title: "Test Event 6",
        description: "This is a short description for event 6.",
        image: "some_image3",
    },
];

function App() {
    return (
        <div className="columns mt-6">
            <div className="column is-one-fifth pd"></div>
            <div className="column">
                <div className="columns">
                    <div className="column">
                        <EventBox eventDetails={Events[0]} />
                        <EventBox eventDetails={Events[3]} />
                    </div>
                    <div className="column">
                        <EventBox eventDetails={Events[1]} />
                        <EventBox eventDetails={Events[4]} />
                    </div>
                    <div className="column">
                        <EventBox eventDetails={Events[2]} />
                        <EventBox eventDetails={Events[5]} />
                    </div>
                </div>
            </div>
            <div className="column is-one-fifth"></div>
        </div>
    );
}

export default App;
