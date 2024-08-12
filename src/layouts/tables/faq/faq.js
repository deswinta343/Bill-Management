import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Card } from '@mui/material';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import React, { useState } from 'react';

function FaQ() {
    const [expandedPanel, setExpandedPanel] = useState(null);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpandedPanel(isExpanded ? panel : null);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <SoftBox pb={3} />
            <Card>
            <Accordion expanded={expandedPanel === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <SoftTypography variant="h6" fontWeight="bold">What is Bill Management?</SoftTypography>
                </AccordionSummary>
                <AccordionDetails>
                     <SoftTypography variant="h6" color="text" fontWeight="medium" style={{ marginRight: '30px' }}>
                     Bill Management provides a streamlined approach to overseeing events within a community or group, enabling efficient distribution of funds to ensure equitable participation in various activities.
                    </SoftTypography>
                </AccordionDetails>
            </Accordion>
            </Card>
            <SoftBox pb={1} />
            <Card>
            <Accordion expanded={expandedPanel === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <SoftTypography variant="h6" fontWeight="bold">What are the benefits and how does the circle work?</SoftTypography>
                </AccordionSummary>
                <AccordionDetails>
                     <SoftTypography variant="h6" color="text" fontWeight="medium" style={{ marginRight: '30px' }}>
                     You have the option to extend invitations to your friends simply by entering their usernames. Once invited, they will seamlessly become part of your circle without any additional steps required.
                    </SoftTypography>
                </AccordionDetails>
            </Accordion>
            </Card>
            <SoftBox pb={1} />
            <Card>
            <Accordion expanded={expandedPanel === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <SoftTypography variant="h6" fontWeight="bold">How do events work?</SoftTypography>
                </AccordionSummary>
                <AccordionDetails>
                     <SoftTypography variant="h6" color="text" fontWeight="medium" style={{ marginRight: '30px' }}>
                     Within the established circle, you have the flexibility to incorporate various events along with their respective dates. Furthermore, friends who have already become members of the circle can effortlessly participate in these events, fostering a seamless and inclusive experience.
                    </SoftTypography>
                </AccordionDetails>
            </Accordion>
            </Card>
            <SoftBox pb={1} />
            <Card>
            <Accordion expanded={expandedPanel === 'panel4'} onChange={handleChange('panel4')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <SoftTypography variant="h6" fontWeight="bold">Can invited colleagues create an event?</SoftTypography>
                </AccordionSummary>
                <AccordionDetails>
                     <SoftTypography variant="h6" color="text" fontWeight="medium" style={{ marginRight: '30px' }}>
                     No, the functionality is limited to members solely participating in the event.
                    </SoftTypography>
                </AccordionDetails>
            </Accordion>
            </Card>
            <SoftBox pb={1} />
            <Card>
            <Accordion expanded={expandedPanel === 'panel5'} onChange={handleChange('panel5')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <SoftTypography variant="h6" fontWeight="bold">What is the function of adding transactions?</SoftTypography>
                </AccordionSummary>
                <AccordionDetails>
                     <SoftTypography variant="h6" color="text" fontWeight="medium" style={{ marginRight: '30px' }}>
                     All event members have the capability to input transactions and review participants, ensuring a fair distribution among them.
                    </SoftTypography>
                </AccordionDetails>
            </Accordion>
            </Card>
            <SoftBox pb={1} />
        </DashboardLayout>
    );
}

export default FaQ;
