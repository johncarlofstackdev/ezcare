import * as React from "react";
import { Modal, Button, Box, Select, CheckIcon, TextArea } from "native-base";

const ReportForm = (props) => {
    const { states, functions, sets } = props;
    return (
        <Modal isOpen={states.SHReportForm} onClose={functions.closeReportForm}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Report Form</Modal.Header>
                <Modal.Body bg="white">
                    <Box width="100%" my="3">
                        <Select
                            selectedValue={states.statesReportFormData.event_type}
                            accessibilityLabel="Choose Service"
                            placeholder="Choose Incident Type"
                            fontSize="lg"
                            _selectedItem={{
                                bg: "error.600",
                                colorScheme: "white",
                                endIcon: <CheckIcon size="5" color="white" />
                            }}
                            mt={1}
                            name="event_type"
                            onValueChange={(value) => sets.setsReportValue((prevData) => ({ ...prevData, event_type: value }))}
                        >
                            <Select.Item label="Near Miss" value="Near Miss" />
                            <Select.Item label="Unsafe Acts" value="Unsafe Acts" />
                            <Select.Item label="Workplace Hazards" value="Workplace Hazards" />
                            <Select.Item label="Minor Injury" value="Minor Injury" />
                            <Select.Item label="Lost Time Accident" value="Lost Time Accident" />
                            <Select.Item label="Security Incident" value="Security Incident" />
                            <Select.Item label="Fire Incident" value="Fire Incident" />
                            <Select.Item label="Fatalities" value="Fatalities" />
                        </Select>
                        <TextArea
                            value={states.statesReportFormData.event_details}
                            mt="4"
                            name="event_details"
                            onChangeText={(value) => sets.setsReportValue((prevData) => ({ ...prevData, event_details: value }))}
                            h={20}
                            fontSize="lg"
                            placeholder="Incident Details"
                        />
                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={functions.closeReportForm}>
                            Cancel
                        </Button>
                        <Button colorScheme="red" onPress={functions.submitReportForm}>
                            Submit Form
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content >
        </Modal >
    );
};

export default React.memo(ReportForm);