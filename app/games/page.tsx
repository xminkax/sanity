import SnakeGame from "@/src/SnakeGame";
import NextLevel from "@/src/NextLevel";
import GameOver from "@/src/GameOver";

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
            <GameOver/>
        </div>
    );
}
