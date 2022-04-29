interface Props {
    eventDetails: EventInterface;
}

function EventBox({ eventDetails }: Props) {
    return (
        <div className="box">
            <div className="card">
                <div className="card-image">
                    <figure className="image is-4by3">
                        <img
                            src="https://bulma.io/images/placeholders/1280x960.png"
                            alt="Placeholder image"
                        />
                    </figure>
                </div>
                <div className="card-content">
                    <div className="content">
                        <p className="title is-4">{eventDetails.title}</p>
                        <p>{eventDetails.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventBox;
