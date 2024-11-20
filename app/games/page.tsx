import SnakeGame from "@/src/SnakeGame";

export default function Games() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                padding: "8rem",
            }}
        >
            {/*<h1>Snake Game</h1>*/}
            <SnakeGame/>
        </div>
    );
}
