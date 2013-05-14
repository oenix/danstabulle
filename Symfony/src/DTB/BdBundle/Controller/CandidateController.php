<?php

namespace DTB\BdBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use DTB\BdBundle\Entity\BandeDessinee;
use DTB\BdBundle\Entity\Candidature;
use DTB\BdBundle\Entity\Planche;
use DTB\BdBundle\Form\CandidatureType;

class CandidateController extends Controller
{
    public function drawerAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
        $bd = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee')->find($id);
        $candidature = new Candidature();
        
        $form = $this->createForm(new CandidatureType, $candidature);
        
        $request = $this->get('request');
        if ($request->getMethod() == 'POST')
        {
            $form->bind($request);
            
            if ($form->isValid())
            {
                $candidature->setUser($this->getUser());
                $candidature->setType("drawer");
                $candidature->setBd($bd);
                $em = $this->getDoctrine()->getManager();
                $em->persist($candidature);
                $em->flush();
                
                return $this->redirect($this->generateUrl('dtb_bd_show', array("id" => $id)));
            }
        }
        
        return $this->render('DTBBdBundle:Candidate:drawer.html.twig', array('bd' => $bd, 'form' => $form->createView()));
    }
    
    public function scenaristAction($id)
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
        $bd = $this->getDoctrine()->getRepository('DTBBdBundle:BandeDessinee')->find($id);
        $candidature = new Candidature();
        
        $form = $this->createForm(new CandidatureType, $candidature);
        
        $request = $this->get('request');
        if ($request->getMethod() == 'POST')
        {
            $form->bind($request);
            
            if ($form->isValid())
            {
                $candidature->setUser($this->getUser());
                $candidature->setType("scenarist");
                $candidature->setBd($bd);
                $em = $this->getDoctrine()->getManager();
                $em->persist($candidature);
                $em->flush();
                
                return $this->redirect($this->generateUrl('dtb_bd_show', array("id" => $id)));
            }
        }
        
        return $this->render('DTBBdBundle:Candidate:scenarist.html.twig', array('bd' => $bd, 'form' => $form->createView()));
    }
    
    public function seeAction($id)
    {
        return $this->render('DTBBdBundle:Candidate:see.html.twig', array());
    }
}
