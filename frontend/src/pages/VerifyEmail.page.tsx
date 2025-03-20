import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "@/api";
import {Flex, Loader, Text} from "@mantine/core";

export function VerifyEmailPage() {
    const {token} = useParams();
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            setTimeout(() => verifyEmail(token), 2000);
        }
    }, [token]);

    const verifyEmail = async (token: string) => {
        try {
            const response = await api.post("/api/verify-email/", {token});

            if (response.status === 200) {
                setIsVerified(true);

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error: any) {
            setError(error.response.data.detail);
        }
    };

    return (
        <Flex justify="center" align="center" style={{height: "calc(100vh - 100px)"}}>
            {isVerified ? (
                <Flex direction="column" justify="center" align="center" rowGap="md">
                    <Text c="dimmed" size="lg" ta="center">
                        Your email has been verified. You will be redirected to the login page in a moment.
                    </Text>
                    <Text size="xl" ta="center">
                        😃
                    </Text>
                </Flex>
            ) : error ? (
                <Text c="red" size="lg" ta="center">
                    {error}
                </Text>
            ) : (
                <Flex direction="column" justify="center" align="center" rowGap="md">
                    <Text c="dimmed" size="lg" ta="center">
                        Verifying your email...
                    </Text>
                    <Loader/>
                </Flex>
            )}
        </Flex>
    );
}